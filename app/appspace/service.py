import os, datetime, time
from pymongo import MongoClient
from library.db_connection_factory import get_collection
import library.db_utils as db_utils
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import app.sequence.service as sequence_service
import app.role.service as role_service
from bson.objectid import ObjectId

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'appspace'
database_name = 100

def find(request):
    roles = role_service.get_roles(request.user_id)
    authorized_appspace_id_list = []
    for role in roles:
        if role['type'] == 'appspace':
            authorized_appspace_id_list.append(ObjectId(role['domainId']))
    data = db_utils.find(database_name, domain, {'_id': {'$in': authorized_appspace_id_list}})
    return (200, {'data': data})

def introspect(request):
    data = db_utils.find(database_name, domain, {}, project=['name', 'appspaceId'])
    return (200, {'data': data})

def find_by_appspace_id(appspace_id):
    appspaceData = get_collection(database_name,domain).find_one({'appspaceId': appspace_id})
    appspaceData['_id'] = str(appspaceData['_id'])
    return (200, appspaceData)

def update(request, appspace_id, data):
    updated_record = db_utils.upsert(appspace_id, domain, data, request.user_id)
    return (200, {'data': updated_record})

def create(data):
    appspaceData = []
    if 'appspaceId' in data:
        appspaceData = db_utils.find(database_name, domain, {'appspaceId': data['appspaceId']})
    if len(appspaceData) == 1:
        return (404, {'data': 'appspace exists'})
    else:
        data['appspaceId'] = str(sequence_service.nextval(100, 'spaceId', 'na'))
        updated_record = db_utils.upsert(database_name, domain, {'name': data['name'],  'appspaceId': data['appspaceId']})
    return (200, {'data': updated_record})


def do_delete_appspace(appspace_id):
    appspaceData = db_utils.find(database_name, domain, {'appspaceId': appspace_id})
    domain_id = []
    for data in appspaceData:
        domain_id = data['_id']
    roleData = db_utils.delete(database_name, 'role', {'domainId': domain_id})
    deleteAppspace = db_utils.delete(database_name,appspace_id,{'spaceId':appspace_id})
    deleteAppspaceData = db_utils.delete(database_name, domain,{'spaceId': appspace_id})
    dropped_database = db_utils.drop_database(appspace_id)
    return (200, {'deletedData': dropped_database})