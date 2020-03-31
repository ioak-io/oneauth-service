from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
from app.space.service import do_get_space, update_space
from app.auth.service import do_signup
import json, base64

@api_view(['POST'])
def create(request):
    space_response = update_space({
        'name': request.body.get('name'),
        'email': request.body.get('email')
    })
    if space_response[0] == 200:
        created_space = space_response[1]['data']
        response = do_signup(created_space.get('spaceId'), {
            'email': request.body.get('email'),
            'password': request.body.get('password'),
            'administrator': True
        })
        return JsonResponse({'space': created_space, 'adminUser': response[1]}, status=response[0])
    else:
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_space(request, space_id):
    response = do_get_space(space_id)
    return JsonResponse(response[1], status=response[0])
