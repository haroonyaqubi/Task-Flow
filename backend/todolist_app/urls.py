from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ContactView

# Create a router for TaskViewSet (handles CRUD operations)
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactView.as_view(), name='contact'),
]