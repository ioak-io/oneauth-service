from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.app.service as service
import app.role.service as role_service
import json, base64

self_space='oneauth'

@api_view(['GET', 'PUT', 'POST'])
def get_update_app(request):
    if request.method == 'GET':
        response = service.find(request)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'PUT':
        response = service.update(request, request.body)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'POST':
        app_response = service.update(request, request.body)
        if app_response[0] == 200:
            created_app = app_response[1]['data']
            role_response = role_service.add_role({
                'type': 'app',
                'userId': request.user_id,
                'domainId': app_response[1]['data']['_id']
            }, request.user_id)
            return JsonResponse({'app': created_app, 'role': role_response}, status=200)
        else:
            return JsonResponse(response[1], status=response[0])
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def find_by_app_id(request, app_id):
    response = service.find_by_app_id(request, app_id)
    return JsonResponse(response[1], status=response[0])
