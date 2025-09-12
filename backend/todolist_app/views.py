from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings

from .models import TaskList
from .serializers import TaskSerializer, ContactSerializer  # <-- make sure ContactSerializer exists


class TaskViewSet(viewsets.ModelViewSet):
    """
    Gestion des tâches pour les utilisateurs et admin.
    Les admins voient toutes les tâches, les utilisateurs seulement les leurs.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TaskList.objects.all().order_by('-created_at')
        return TaskList.objects.filter(gestionnaire=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(gestionnaire=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        """Marquer une tâche comme terminée"""
        task = self.get_object()
        task.done = True
        task.save()
        return Response({'status': 'Tâche terminée'})

    @action(detail=True, methods=['post'])
    def mark_pending(self, request, pk=None):
        """Marquer une tâche comme en attente"""
        task = self.get_object()
        task.done = False
        task.save()
        return Response({'status': 'Tâche en attente'})


# ---------------- CONTACT FORM VIEW ----------------

class ContactView(APIView):
    """API pour le formulaire de contact"""
    permission_classes = []  # public access

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']

            try:
                send_mail(
                    f"Contact Form: {subject}",
                    f"From: {name} <{email}>\n\nMessage:\n{message}",
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],  # admin email
                    fail_silently=False,
                )
                return Response({"success": "Message envoyé avec succès!"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
