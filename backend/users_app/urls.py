from django.urls import path
from .views import RegisterView, MeView, UserListView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('users/', UserListView.as_view(), name='user-list'),  # GET (list) / POST (create)
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # GET/PUT/DELETE single user
]


