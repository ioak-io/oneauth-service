from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.role.service as service
import json, base64

@api_view(['GET', 'POST'])
def add_get_roles(request):
    if request.method == 'GET':
        response = service.do_get_roles(request)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'POST':
        response = service.do_add_role(request, request.body)
        return JsonResponse(response[1], status=response[0])

@api_view(['DELETE'])
def delete_role(request, type_name, user_id, domain_id):
    response = service.delete_role(request, type_name, user_id, domain_id)
    return JsonResponse(response[1], status=response[0])