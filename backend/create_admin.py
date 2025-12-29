import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'complice_taches.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@taskflow.com', 'Admin123')
    print(' Superuser created: admin / Admin123')
else:
    print(' Superuser already exists')