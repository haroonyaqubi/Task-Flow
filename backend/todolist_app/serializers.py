from rest_framework import serializers
from .models import TaskList

class TaskSerializer(serializers.ModelSerializer):
    gestionnaire = serializers.CharField(source='gestionnaire.username', read_only=True)

    class Meta:
        model = TaskList
        fields = ['id', 'task', 'done', 'gestionnaire']
        read_only_fields = ['gestionnaire']


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()