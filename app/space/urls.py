from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('', views.get_update),
    path('<str:space_id>', views.get_space),
    path('delete/<str:space_id>', views.delete_space),
]