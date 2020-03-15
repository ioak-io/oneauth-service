from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.auth.service as service
from django.core import serializers
import json

@api_view(['POST'])
def signup(request, space):
    response = service.do_signup(space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def authorize(request, space):
    response = service.do_authorize(space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, space, auth_key):
    response = service.get_session_token(space, auth_key)
    return JsonResponse(response[1], status=response[0])
