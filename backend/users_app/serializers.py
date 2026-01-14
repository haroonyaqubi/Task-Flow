from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}


    )
    consentement_rgpd = serializers.BooleanField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Vous devez accepter la politique de confidentialité.'
        }
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'consentement_rgpd']



    def validate_consentement_rgpd(self, value):
        """Validate that GDPR consent is given"""
        if not value:
            raise serializers.ValidationError("Vous devez accepter la politique de confidentialité.")
        return value

    def validate_email(self, value):
            """Check if email is already registered"""
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Cette adresse email est déjà utilisée.")
            return value

    def create(self, validated_data):
        validated_data.pop('consentement_rgpd')
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']  # Django hache automatiquement ici
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for viewing/editing users (admin only)"""

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active']