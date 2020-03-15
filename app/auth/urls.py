from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('signup', views.signup),
    path('authorize', views.authorize),
    path('session/<str:auth_key>', views.get_session_token),
]
