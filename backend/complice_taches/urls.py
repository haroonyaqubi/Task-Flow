from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# HEALTH CHECK ENDPOINT
@csrf_exempt
def health_check(request):
    """Simple endpoint to check if API is running"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'TaskFlow Backend API',
        'version': '1.0',
        'endpoints': {
            'authentication': '/api/token/',
            'user_management': '/api/user/',
            'task_management': '/api/tasks/',
            'admin_panel': '/admin/'
        }
    })



# API ROOT ENDPOINT
@csrf_exempt
def api_root(request):
    """Main page of API - shows basic info"""
    return JsonResponse({
        'application': 'TaskFlow - Task Management System',
        'description': 'REST API for task management with JWT authentication',
        'authentication': 'JWT tokens required for protected endpoints',
        'frontend': 'https://task-flow-frontend-6x3i.onrender.com',
    })


# URL PATTERNS
urlpatterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/', include('todolist_app.urls')),
    path('api/user/', include('users_app.urls')),
    path('api-auth/', include('rest_framework.urls')),
]



