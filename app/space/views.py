from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.space.service as service
from app.auth.service import do_signup
import app.role.service as role_service
import app.user.service as user_service
import json, base64

self_space='oneauth'

@api_view(['GET', 'POST'])
def get_update(request):
    if request.method == 'GET':
        response = service.find(request)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'PUT':
        response = service.update(request, self_space, request.body)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'POST':
        space_response = service.update_space({
            'name': request.body.get('name'),
            'email': request.body.get('email')
        })
        if space_response[0] == 200:
            created_space = space_response[1]['data']
            oa_user = user_service.get_user_by_email(self_space, request.body.get('email'))[0]
            user_response = do_signup(created_space.get('spaceId'), {
                'email': request.body.get('email'),
                'password': request.body.get('password'),
                'firstName': oa_user.get('firstName'),
                'lastName': oa_user.get('lastName')
            })
            role_response = role_service.add_role({
                'type': 'space',
                'userId': oa_user['_id'],
                'domainId': space_response[1]['data']['_id']
            }, request.user_id)
            return JsonResponse({'space': created_space, 'user': user_response[1]['data'], 'role': role_response}, status=200)
        else:
            return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_space(request, space_id):
    response = service.find_by_space_id(space_id)
    return JsonResponse(response[1], status=response[0])
