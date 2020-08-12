from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.auth.app_service as new_service
from django.core import serializers
import json

@api_view(['POST'])
def signup(request, app_id):
    print(request.body, app_id)
    response = new_service.do_signup(app_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def change_password(request, app_id):
    response = new_service.change_password(app_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def update_profile(request, app_id):
    response = new_service.update_profile(app_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password_link(request, app_id):
    response = new_service.reset_password_link(app_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_password_link(request, app_id, auth_code):
    response = new_service.verify_password_link(app_id, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def email_confirmation_link(request, app_id):
    console.log(request.body)
    response = new_service.email_confirmation_link(app_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_email_confirmation_link(request, app_id, auth_code):
    response = new_service.verify_email_confirmation_link(app_id, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password(request, app_id, auth_code):
    response = new_service.reset_password(app_id, auth_code, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize(request, app_id):
    response = new_service.do_authorize(app_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize_google(request, app_id, token):
    response = new_service.do_authorize_google(app_id, token)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize_facebook(request, app_id):
    response = new_service.do_authorize_facebook(app_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, app_id, auth_key):
    response = new_service.get_session(app_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def invalidate_session_token(request, app_id, auth_key):
    response = new_service.invalidate_session_token(app_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_all_users(request):
    response = new_service.get_all_users(request)
    return JsonResponse(response[1], status=response[0])