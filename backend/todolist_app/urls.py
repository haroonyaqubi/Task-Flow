from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ContactView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),  # tasks endpoints will be /api/tasks/ now
    path('contact/', ContactView.as_view(), name='contact'),  # contact form will be /api/contact/
]
