from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('', views.get_update),
    path('app/<str:app_id>', views.find_by_app_id),
    path('space/<str:space_id>', views.find_by_space_id),
    path('<str:space_id>/<str:app_id>', views.find_delete_by_id)
]