from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def health_check(request):
    return JsonResponse({
        'status': 'ok',
        'service': 'TaskFlow Backend API',
        'endpoints': {
            'api_root': '/api/',
            'register': '/api/user/register/',
            'login': '/api/token/',
            'tasks': '/api/tasks/',
            'admin': '/admin/',
            'health': '/health/'
        },
        'frontend': 'Will be deployed separately as Static Site'
    })


@csrf_exempt
def api_root(request):
    return JsonResponse({
        'message': 'TaskFlow API',
        'version': '1.0',
        'endpoints': {
            'auth': {
                'register': '/api/user/register/',
                'login': '/api/token/',
                'refresh': '/api/token/refresh/',
                'me': '/api/user/me/'
            },
            'tasks': {
                'list': '/api/tasks/',
                'create': '/api/tasks/',
                'detail': '/api/tasks/{id}/'
            },
            'admin': '/admin/'
        }
    })


urlpatterns = [
    # API Documentation
    path('', api_root, name='api-root'),

    # Health check
    path('health/', health_check, name='health'),

    # Admin
    path('admin/', admin.site.urls),

    # API Endpoints
    path('api/', include('todolist_app.urls')),
    path('api/user/', include('users_app.urls')),

    # Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Browser API (DRF login)
    path('api-auth/', include('rest_framework.urls')),
]