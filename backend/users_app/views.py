from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer

# ---------- INSCRIPTION ----------
class RegisterView(generics.CreateAPIView):
    """
    Crée un nouvel utilisateur.
    Le consentement RGPD est obligatoire.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        if not request.data.get("consentement_rgpd", False):
            return Response(
                {"error": "Vous devez accepter la politique de confidentialité."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

# ---------- UTILISATEUR ACTUEL ----------
class MeView(generics.RetrieveAPIView):
    """Retourne les informations de l'utilisateur connecté"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "nom_utilisateur": user.username,
            "email": user.email,
            "prenom": user.first_name,
            "nom": user.last_name,
            "est_admin": user.is_staff
        })

# ---------- CRUD UTILISATEURS (Admin uniquement) ----------
class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
