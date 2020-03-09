from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.faq.service as service

@api_view(['GET', 'PUT'])
def get_update_faq(request, space):
    if request.method == 'GET':
        response = service.find(request, space)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'PUT':
        response = service.update(request, space, request.body)
        return JsonResponse(response[1], status=response[0])
    
@api_view(['DELETE'])
def delete_faq(request,space,id):
    if request.method == 'DELETE':
        response = service.delete(request, space, id)
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_by_category(request, space, category):
    if request.method == 'GET':
        response = service.find_faq_by_category(request, space, category)
        return JsonResponse(response[1], status=response[0])