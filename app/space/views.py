from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.space.service as service
import app.auth.service as auth_service
import app.role.service as role_service
import app.user.service as user_service
import json, base64

self_space=100

@api_view(['GET', 'POST', 'PUT'])
def get_update(request):
    if request.method == 'GET':
        response = service.find(request)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'PUT':
        response = service.update(request, self_space, request.body)
        return JsonResponse(response[1], status=response[0])
    if request.method == 'POST':
        oa_user_list = user_service.get_user_by_id(self_space, request.body.get('userId'))
        if len(oa_user_list) == 0:
            return JsonResponse({'data': 'user does not exist'}, status=404)
        oa_user = oa_user_list[0]
        space_response = service.create({
            'name': request.body.get('name'),
            'email': oa_user.get('email'),
            'sessionExpiry': request.body.get('sessionExpiry')
        })
        if space_response[0] == 200:
            created_space = space_response[1]['data']
            user_to_add = {
                'email': oa_user.get('email'),
                'firstName': oa_user.get('firstName'),
                'lastName': oa_user.get('lastName')
            }
            if oa_user.get('type') == 'oneauth':
                user_to_add['password'] = request.body.get('password')
                user_response = auth_service.do_signup(created_space.get('spaceId'), user_to_add)
            else:
                user_to_add['type'] = oa_user['type']
                user_response = auth_service.do_signup_extern_provider(created_space.get('spaceId'), user_to_add)
            
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

@api_view(['DELETE'])
def delete_space(request, space_id):
    response = service.do_delete_space(space_id)
    return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def introspect(request):
    response = service.introspect(request)
    return JsonResponse(response[1], status=response[0])