from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('', views.add_get_roles),
    path('<str:type_name>/<str:user_id>/<str:domain_id>', views.delete_role)
]