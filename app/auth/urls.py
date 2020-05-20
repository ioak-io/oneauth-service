from django.urls import path
from django.conf.urls import url

from . import oa_views, space_views

urlpatterns = [
    path('<str:space_id>/signup', space_views.signup),
    path('<str:space_id>/resetpasswordlink', space_views.reset_password_link),
    path('<str:space_id>/verifypasswordlink/<str:auth_code>', space_views.verify_password_link),
    path('<str:space_id>/emailconfirmationlink', space_views.email_confirmation_link),
    path('<str:space_id>/verifyemailconfirmationlink/<str:auth_code>', space_views.verify_email_confirmation_link),
    path('<str:space_id>/resetpassword/<str:auth_code>', space_views.reset_password),
    path('<str:space_id>/changepassword', space_views.change_password),
    path('<str:space_id>/updateprofile', space_views.update_profile),
    path('<str:space_id>/authorize', space_views.authorize),
    path('<str:space_id>/authorize/google/<str:token>', space_views.authorize_google),
    path('<str:space_id>/authorize/facebook', space_views.authorize_facebook),
    path('<str:space_id>/session/<str:auth_key>', space_views.get_session_token),
    path('<str:space_id>/session/<str:auth_key>/invalidate', space_views.invalidate_session_token),
    path('signup', oa_views.signup),
    path('resetpasswordlink', oa_views.reset_password_link),
    path('verifypasswordlink/<str:auth_code>', oa_views.verify_password_link),
    path('emailconfirmationlink', oa_views.email_confirmation_link),
    path('verifyemailconfirmationlink/<str:auth_code>', oa_views.verify_email_confirmation_link),
    path('resetpassword/<str:auth_code>', oa_views.reset_password),
    path('changepassword', oa_views.change_password),
    path('updateprofile', oa_views.update_profile),
    path('authorize', oa_views.authorize),
    path('authorize/google/<str:token>', oa_views.authorize_google),
    path('authorize/facebook', oa_views.authorize_facebook),
    path('session/<str:auth_key>', oa_views.get_session_token),
    path('session/<str:auth_key>/invalidate', oa_views.invalidate_session_token),
    path('', space_views.get_all_users),
]
