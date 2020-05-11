from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.auth.service as service
from django.core import serializers
import json

@api_view(['POST'])
def signup(request, space_id):
    response = service.do_signup(space_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def change_password(request, space_id):
    response = service.change_password(space_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password_link(request, space_id):
    response = service.reset_password_link(space_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def verify_password_link(request, space_id, auth_code):
    response = service.verify_password_link(space_id, auth_code)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def reset_password(request, space_id, auth_code):
    response = service.reset_password(space_id, auth_code, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize(request, space_id):
    response = service.do_authorize(space_id, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, space_id, auth_key):
    response = service.get_session(space_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def invalidate_session_token(request, space_id, auth_key):
    response = service.invalidate_session_token(space_id, auth_key)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_all_users(request):
    response = service.get_all_users(request)
    return JsonResponse(response[1], status=response[0])