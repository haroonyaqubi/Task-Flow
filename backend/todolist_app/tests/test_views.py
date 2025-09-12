import pytest
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_create_task_authenticated():
    user = User.objects.create_user(username="john", password="pwd123")
    client = APIClient()
    client.force_authenticate(user=user)

    # Use the correct route name from the router's basename
    response = client.post(reverse("tasks-list"), {"task": "Read a book"})

    assert response.status_code == 201
    assert response.data["task"] == "Read a book"
