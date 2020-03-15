from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from celery.result import AsyncResult
import json

@api_view(['GET'])
def get_result(request, task_id):
    res = AsyncResult(task_id)
    response = res.collect()
    for a, v in response:
        return JsonResponse(v, status=200)

@api_view(['GET'])
def get_status(request, task_id):
    res = AsyncResult(task_id)
    return HttpResponse(res.state, status=200)
