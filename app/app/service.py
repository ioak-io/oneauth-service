import os, datetime, time
from pymongo import MongoClient
import library.db_utils as db_utils
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import secrets

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'app'
database_name='oneauth'

def find(request):
    data = db_utils.find(database_name, domain, {})
    return (200, {'data': data})

def update(request, data):
    try:
        data['appId']
    except KeyError:
        data['appId'] = secrets.token_hex(12)
    updated_record = db_utils.upsert(database_name, domain, data, request.user_id)
    return (200, {'data': updated_record})

def find_by_app_id(request, app_id):
    data = db_utils.find(database_name, domain, {'appId': app_id})
    if len(data) == 1:
        return (200, {'data': data[0]})
    else:
        return (404, {'data': 'not found'})
