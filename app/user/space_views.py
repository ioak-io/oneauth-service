from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import app.user.service as service
from django.core import serializers
import json

@api_view(['POST'])
def update_profile(request, space_id):
    response = service.update_profile(space_id, request.body, request.user_id)
    return JsonResponse(response[1], status=response[0])

