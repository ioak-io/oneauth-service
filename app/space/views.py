from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
from app.space.service import do_create, do_get_space, do_update_space
from app.auth.service import do_signup
import json, base64

@api_view(['POST'])
def create(request):
    response = do_create({
        'name': request.body.get('name'),
        'email': request.body.get('email')
    })
    if response[0] == 200:
        response = do_signup(request.body.get('name'), {
            'email': request.body.get('email'),
            'password': request.body.get('password'),
            'administrator': True
        })
        return JsonResponse(response[1], status=response[0])
    else:
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_space(request, space):
    response = do_get_space(space)
    return JsonResponse(response[1], status=response[0])
