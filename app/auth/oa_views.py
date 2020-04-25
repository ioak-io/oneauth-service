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
def authorize(request):
    response = service.do_authorize(self_space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_session_token(request, auth_key):
    response = service.get_session(self_space, auth_key)
    return JsonResponse(response[1], status=response[0])
