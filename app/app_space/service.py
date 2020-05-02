import os, datetime, time
from pymongo import MongoClient
import library.db_utils as db_utils
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import app.role.service as role_service
from bson.objectid import ObjectId
import secrets

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'appspace'
database_name='oneauth'

def find(request):
    data = db_utils.find(database_name, domain, {})
    return (200, {'data': data})

def update(request, data):
    existing_record = db_utils.find(database_name, domain, {'appId': data['appId'], 'spaceId': data['spaceId']})
    if len(existing_record) == 0:
        inserted_record = db_utils.upsert(database_name, domain, data, request.user_id)
        return (200, {'data': inserted_record})
    else:
        return (200, {'data': existing_record[0]})

def find_by_id(request, id):
    data = db_utils.find(database_name, domain, {'_id': id})
    if len(data) == 1:
        return (200, {'data': data})
    else:
        return (404, {'data': 'not found'})

def find_by_app_id(request, app_id):
    data = db_utils.find(database_name, domain, {'appId': app_id})
    if len(data) >= 1:
        return (200, {'data': data})
    else:
        return (404, {'data': 'not found'})

def find_by_space_id(request, space_id):
    data = db_utils.find(database_name, domain, {'spaceId': space_id})
    if len(data) >= 1:
        return (200, {'data': data})
    else:
        return (404, {'data': 'not found'})

def delete_by_id(id):
    out = db_utils.delete(database_name, domain, {'_id': id})
    return (200, {'deleted_count': out.deleted_count})
