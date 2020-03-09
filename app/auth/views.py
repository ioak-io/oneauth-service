from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from app.auth.service import generate_keys, get_keys, do_signup, do_signin, do_jwttest, do_signin_via_jwt
from django.core import serializers
import json

@api_view(['GET'])
def keys(request, space):
    response = generate_keys()
    return JsonResponse(response[1], status=response[0])

@api_view(['POST'])
def signup(request, space):
    response = do_signup(space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def getKeys(request, space, email):
    response = get_keys(space, email)
    return HttpResponse(response[1].get('problem'), status=response[0])

@api_view(['POST'])
def signin(request, space):
    response = do_signin(space, request.body)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def jwtTest(request, space):
    response = do_jwttest(space)
    return HttpResponse(response[1], status=response[0])

@api_view(['POST'])
def signin_jwt(request, space):
    response = do_signin_via_jwt(space, request.body)
    return JsonResponse(response[1], status=response[0])