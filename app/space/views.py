from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
from app.space.service import do_create, do_get_space, do_get_banner, do_update_space
from app.auth.service import do_signup
import json, base64

@api_view(['POST'])
def create(request):
    if request.FILES != None:
        banner = request.FILES.get('banner')
    else:
        banner = None
    response = do_create({
        'name': request.POST.get('spaceName'),
        'ownerEmail': request.POST.get('email'),
        'jwtPassword':request.POST.get('jwtPassword')
    }, banner)
    if response[0] == 200:
        response = do_signup(request.POST.get('spaceName'), {
            'email': request.POST.get('email'),
            'problem': request.POST.get('problem'),
            'solution': request.POST.get('solution')
        })
        return JsonResponse(response[1], status=response[0])
    else:
        return JsonResponse(response[1], status=response[0])

@api_view(['GET'])
def get_banner(request, space):
    response = do_get_banner(space)
    return HttpResponse(response[1], status=response[0])

@api_view(['GET'])
def get_space(request, space):
    response = do_get_space(space)
    return JsonResponse(response[1], status=response[0])

@api_view(['PUT'])
def add_stage(request,space):
    response = do_update_space(space,request.body)
    return JsonResponse(response[1], status=response[0])