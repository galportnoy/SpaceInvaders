"""
WSGI config for spaceinvaders project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

SERVER_BASE = '/var/www/spaceinvaders/server'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spaceinvaders.settings')

sys.path.append(SERVER_BASE)
sys.path.append(f'{SERVER_BASE}/spaceinvaders')

application = get_wsgi_application()
