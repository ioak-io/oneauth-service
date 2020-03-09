from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('keys', views.keys),
    path('keys/<str:email>/', views.getKeys),
    path('signup', views.signup),
    path('signin', views.signin),
    path('jwttest', views.jwtTest),
    path('signin/jwt', views.signin_jwt)
]
