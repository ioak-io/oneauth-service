from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
import app.healthcheck.service as service
import json, base64

@api_view(['GET'])
def hello(request):
    if request.method == 'GET':
        return JsonResponse({'hello': 'basic connection to server works. database connection is not validated'}, status=200)

@api_view(['GET'])
def test(request):
    if request.method == 'GET':
        db_outcome = service.test_database()
        if db_outcome == False:
            return JsonResponse({'database': False}, status=400)
        else:
            return JsonResponse({'database': True}, status=200)
