import os, datetime, time
from pymongo import MongoClient
import library.db_utils as db_utils
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import app.sequence.service as sequence_service
import app.role.service as role_service
import app.appspace.service as appspace_service
from bson.objectid import ObjectId
import secrets

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'app'
database_name=100

def find(request):
    roles = role_service.get_roles(request.user_id)
    authorized_app_id_list = []
    for role in roles:
        if role['type'] == 'app':
            authorized_app_id_list.append(ObjectId(role['domainId']))
    data = db_utils.find(database_name, domain, {'_id': {'$in': authorized_app_id_list}})
    return (200, {'data': data})

def update(request, data):
    try:
        data['appId']
    except KeyError:
        data['appId'] = secrets.token_hex(12)
        updated_record = db_utils.upsert(database_name, domain, data, request.user_id)
        appspace_service.create(data)
    return (200, {'data': updated_record})

def find_by_app_id(request, app_id):
    data = db_utils.find(database_name, domain, {'appId': app_id})
    if len(data) == 1:
        return (200, {'data': data[0]})
    else:
        return (404, {'data': 'not found'})

def do_delete_app(app_id):
    appData = db_utils.find(database_name, domain, {'appId': app_id})
    domain_id = []
    for data in appData:
        domain_id = data['_id']
    roleData = db_utils.delete(database_name, 'role', {'domainId': domain_id})
    deleteApp = db_utils.delete(database_name, app_id,{})
    deleteAppData = db_utils.delete(database_name, domain,{'appId': app_id})
    return (200, {'deletedData': ''})