from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.auth.appspace_service as service
from django.core import serializers
import json

@api_view(['POST'])
def signup(request, appspace_id):
    print(request.body, appspace_id)
    response = service.do_signup(appspace_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def change_password(request, appspace_id):
    response = service.change_password(appspace_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def update_profile(request, appspace_id):
    response = service.update_profile(appspace_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password_link(request, appspace_id):
    response = service.reset_password_link(appspace_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_password_link(request, appspace_id, auth_code):
    response = service.verify_password_link(appspace_id, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def email_confirmation_link(request, appspace_id):
    console.log(request.body)
    response = service.email_confirmation_link(appspace_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_email_confirmation_link(request, appspace_id, auth_code):
    response = service.verify_email_confirmation_link(appspace_id, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password(request, appspace_id, auth_code):
    response = service.reset_password(appspace_id, auth_code, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize(request, appspace_id):
    response = service.do_authorize(appspace_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize_google(request, appspace_id, token):
    response = service.do_authorize_google(appspace_id, token)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize_facebook(request, appspace_id):
    response = service.do_authorize_facebook(appspace_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, appspace_id, auth_key):
    response = service.get_session(appspace_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def invalidate_session_token(request, appspace_id, auth_key):
    response = service.invalidate_session_token(appspace_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_all_users(request):
    response = service.get_all_users(request)
    return JsonResponse(response[1], status=response[0])