from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('todolist_app.urls')),  # Tâches
    path('api/user/', include('users_app.urls')),  # Utilisateurs
    path('api-auth/', include('rest_framework.urls')),  # Navigateur API
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ ADD THIS: Serve React for all non-API routes
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)