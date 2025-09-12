from django.db import models
from django.contrib.auth.models import User

class TaskList(models.Model):
    id = models.AutoField(primary_key=True)
    gestionnaire = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    task = models.CharField(max_length=200)
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        status = "Terminée" if self.done else "En attente"
        return f"{self.task} - {status}"

