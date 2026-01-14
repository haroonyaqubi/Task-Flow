from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings

from .models import TaskList
from .serializers import TaskSerializer, ContactSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

#Decide which tasks to show based on user
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TaskList.objects.all().order_by('-created_at')
        return TaskList.objects.filter(gestionnaire=user).order_by('-created_at')

    #When creating a task, automatically assign current user
    def perform_create(self, serializer):
        serializer.save(gestionnaire=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        if 'done' not in request.data:
            return Response(
                {'error': 'Please provide "done" (true/false) in request data'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the task status
        task.done = request.data['done']
        task.save()

        # Return appropriate message
        status_text = "terminée" if task.done else "en attente"
        return Response({'status': f'Tâche {status_text}'})


#CONTACT FORM VIEW
class ContactView(APIView):
    #Handles contact form submissions with specific error handling
    permission_classes = []

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']

            try:
                email_sent = send_mail(
                    f"Contact Form: {subject}",
                    f"From: {name} <{email}>\n\nMessage:\n{message}",
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],
                    fail_silently=False,
                )
                # Check if email was actually sent
                if email_sent == 1:
                    return Response({"success": "Message envoyé avec succès!"}, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"error": "Échec de l'envoi de l'email. Veuillez réessayer plus tard."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            except ConnectionRefusedError:
                return Response(
                    {"error": "Impossible de se connecter au serveur de messagerie."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            except TimeoutError:
                return Response(
                    {"error": "Délai d'attente dépassé lors de l'envoi de l'email."},
                    status=status.HTTP_504_GATEWAY_TIMEOUT
                )
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Email sending failed: {str(e)}")

                return Response(
                    {"error": "Une erreur est survenue lors de l'envoi du message."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)