from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.app_space.service as service
import json, base64

self_space='oneauth'

@api_view(['GET', 'PUT'])
def get_update(request):
    if request.method == 'GET':
        response = service.find(request)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'PUT':
        response = service.update(request, request.body)
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def find_by_app_id(request, app_id):
    response = service.find_by_app_id(request, app_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def find_by_space_id(request, space_id):
    response = service.find_by_space_id(request, space_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET', 'DELETE'])
def find_delete_by_id(request, space_id, app_id):
    if request.method == 'GET':
        response = service.find_by_id(request, app_id)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'DELETE':
        response = service.delete_by_id(space_id, app_id)
        return JsonResponse(response[1], status=response[0])
