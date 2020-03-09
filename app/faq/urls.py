from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns =[
    path('', views.get_update_faq),
    path('<str:id>', views.delete_faq),
    path('category/<str:category>', views.get_by_category)
]