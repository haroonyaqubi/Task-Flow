from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('todolist_app.urls')),  # Tâches
    path('api/user/', include('users_app.urls')),  # Utilisateurs
    path('api-auth/', include('rest_framework.urls')),  # Navigateur API
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
