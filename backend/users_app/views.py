from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer

# ---------- USER REGISTRATION ----------
class RegisterView(generics.CreateAPIView):
    """
    Creates a new user account
    GDPR consent is required
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can register

    def create(self, request, *args, **kwargs):
        """Override to check GDPR consent"""
        if not request.data.get("consentement_rgpd", False):
            return Response(
                {"error": "Vous devez accepter la politique de confidentialité."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # If GDPR is accepted, create the user
        return super().create(request, *args, **kwargs)

# ---------- CURRENT USER INFO ----------
class MeView(generics.RetrieveAPIView):
    """Returns information about the currently logged in user"""
    permission_classes = [permissions.IsAuthenticated]  # Must be logged in

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "nom_utilisateur": user.username,
            "email": user.email,
            "prenom": user.first_name,
            "nom": user.last_name,
            "est_admin": user.is_staff  # Whether user is admin
        })

# ---------- USER MANAGEMENT (Admin only) ----------
class UserListView(generics.ListCreateAPIView):
    """Admin: List all users or create new ones"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can access

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: View, update, or delete a specific user"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can access