from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.auth.service as service
from django.core import serializers
import json

self_space = 'oneauth'

@api_view(['POST'])
def signup(request):
    response = service.do_signup(self_space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def change_password(request):
    response = service.change_password(self_space, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password_link(request):
    response = service.reset_password_link(self_space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_password_link(request, auth_code):
    response = service.verify_password_link(self_space, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def email_confirmation_link(request):
    response = service.email_confirmation_link(self_space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_email_confirmation_link(request, auth_code):
    response = service.verify_email_confirmation_link(self_space, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password(request, auth_code):
    response = service.reset_password(self_space, auth_code, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize(request):
    response = service.do_authorize(self_space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, auth_key):
    response = service.get_session(self_space, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def invalidate_session_token(request, auth_key):
    response = service.invalidate_session_token(self_space, auth_key)
    return JsonResponse(response[1], status=response[0])
