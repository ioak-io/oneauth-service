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

domain = 'role'
database_name='oneauth'

def do_get_roles(request):
    # data = get_roles(request.user_id)
    data = db_utils.find(database_name, domain, {})
    return (200, {'data': data})

def get_roles(user_id):
    return db_utils.find(database_name, domain, {'userId': user_id})

def do_add_role(request, data):
    updated_record = add_role(data, request.user_id)
    return (200, {'data': updated_record})

def add_role(data, user_id):
    existing_record = db_utils.find(database_name, domain, {'userId': data['userId'], 'domainId': data['domainId'], 'type': data['type']})
    if len(existing_record) == 0:
        return db_utils.upsert(database_name, domain, data, user_id)
    else:
        return existing_record[0]

def delete_role(request, type_name, user_id, domain_id):
    print(type_name, user_id , domain_id)
    out = db_utils.delete(database_name, domain, {'type': type_name, 'userId': user_id, 'domainId': domain_id})
    print(out.deleted_count)
    return (200, {'data': out.deleted_count})
