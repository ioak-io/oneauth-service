from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('', views.get_update_app),
    path('<str:app_id>', views.find_by_app_id)
]