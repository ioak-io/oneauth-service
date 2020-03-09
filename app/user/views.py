from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.user.service as service

@api_view(['GET', 'PUT'])
def do(request, space):
    if request.method == 'GET':
        response = service.find(request, space)
        return JsonResponse(response[1], status=response[0])
    elif request.method == 'PUT':
        response = service.update_user(request, space)
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_all(request, space):
    if request.method == 'GET':
        response = service.find_all(request, space)
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def permittedActions(request, space):
    response = service.find_permitted_actions(space, request.user_id)
    return (200, {'data': response})
