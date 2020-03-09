from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('create', views.create),
    path('<str:space>', views.get_space),
    path('banner/<str:space>', views.get_banner),
    path('stage/<str:space>', views.add_stage)
]