import pytest
from django.contrib.auth.models import User
from todolist_app.models import TaskList
from todolist_app.serializers import TaskSerializer


@pytest.mark.django_db
def test_tasklist_serializer_fields():
    user = User.objects.create_user(username="bob", password="pwd123")
    task = TaskList.objects.create(gestionnaire=user, task="Clean room")

    data = TaskSerializer(task).data

    assert data["task"] == "Clean room"
    assert "done" in data
    assert data["gestionnaire"] == "bob"
