import pytest
from django.contrib.auth.models import User
from todolist_app.models import TaskList


@pytest.mark.django_db
def test_task_str_returns_status():
    user = User.objects.create_user(username="alice", password="pwd123")
    task = TaskList.objects.create(gestionnaire=user, task="Buy milk")

    # Check string representation
    status = str(task)
    assert "Buy milk" in status
    assert "Terminée" in status or "En attente" in status
