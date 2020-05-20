from django.urls import path
from django.conf.urls import url

from . import oa_views, space_views

urlpatterns = [
    path('<str:space_id>/updateprofile', space_views.update_profile),
    path('updateprofile', oa_views.update_profile)
]
