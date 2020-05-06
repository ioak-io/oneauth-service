from django.urls import path
from django.conf.urls import url

from . import oa_views, space_views

urlpatterns = [
    path('<str:space_id>/signup', space_views.signup),
    path('<str:space_id>/authorize', space_views.authorize),
    path('<str:space_id>/session/<str:auth_key>', space_views.get_session_token),
    path('<str:space_id>/session/<str:auth_key>/invalidate', space_views.invalidate_session_token),
    path('signup', oa_views.signup),
    path('authorize', oa_views.authorize),
    path('session/<str:auth_key>', oa_views.get_session_token),
    path('session/<str:auth_key>/invalidate', oa_views.invalidate_session_token),
    path('', space_views.get_all_users),
]
