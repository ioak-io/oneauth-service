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

domain = 'space'
database_name = 100

def find(request):
    roles = role_service.get_roles(request.user_id)
    authorized_space_id_list = []
    for role in roles:
        if role['type'] == 'space':
            authorized_space_id_list.append(ObjectId(role['domainId']))
    data = db_utils.find(database_name, domain, {'_id': {'$in': authorized_space_id_list}})
    return (200, {'data': data})

def find_by_space_id(space_id):
    spaceData = get_collection(database_name,domain).find_one({'spaceId': space_id})
    spaceData['_id'] = str(spaceData['_id'])
    return (200, spaceData)

def update(request, space_id, data):
    print(data)
    updated_record = db_utils.upsert(space_id, domain, data, request.user_id)
    return (200, {'data': updated_record})

def create(data):
    spaceData = []
    if 'spaceId' in data:
        spaceData = db_utils.find(database_name, domain, {'spaceId': data['spaceId']})
    if len(spaceData) == 1:
        existingSpace = spaceData[0]
        existingSpace['name'] = data['name']
        existingSpace['email'] = data['email']
        existingSpace['sessionExpiry'] = data['sessionExpiry']
        updated_record = db_utils.upsert(database_name, domain, existingSpace)
    else:
        data['spaceId'] = str(sequence_service.nextval(100, 'spaceId', 'na'))
        updated_record = db_utils.upsert(database_name, domain, data)
    return (200, {'data': updated_record})


def do_delete_space(space_id):
    spaceData = db_utils.find(database_name, domain, {'spaceId': space_id})
    domain_id = []
    for data in spaceData:
        domain_id = data['_id']
    roleData = db_utils.delete(database_name, 'role', {'domainId': domain_id})
    deleteSpace = db_utils.delete(database_name,space_id,{'spaceId':space_id})
    deleteSpaceData = db_utils.delete(database_name, domain,{'spaceId': space_id})
    return (200, {'deletedData': ''})