
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework.authtoken.views import obtain_auth_token

from . import views

from rest_framework.routers import DefaultRouter

from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='main'),
    url(r'^obtain-auth-token/$', obtain_auth_token)
]

urlpatterns += router.urls
