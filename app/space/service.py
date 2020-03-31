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
database_name = 'oneauth'

def find(request):
    roles = role_service.get_roles(request.user_id)
    authorized_space_id_list = []
    for role in roles:
        if role['type'] == 'space':
            authorized_space_id_list.append(ObjectId(role['domainId']))
    data = db_utils.find(database_name, domain, {'_id': {'$in': authorized_space_id_list}})
    return (200, {'data': data})

def do_get_space(space_id):
    spaceData = get_collection(database_name,domain).find_one({'spaceId': space_id})
    spaceData['_id'] = str(spaceData['_id'])
    return (200, spaceData)

def update_space(data):
    spaceData = []
    if 'spaceId' in data:
        spaceData = db_utils.find(database_name,domain, {'spaceId': data['spaceId']})
    if len(spaceData) == 1:
        existingSpace = spaceData[0]
        existingSpace['name'] = data['name']
        existingSpace['email'] = data['email']
        updated_record = db_utils.upsert(database_name, domain, existingSpace)
    else:
        data['spaceId'] = 'oa' + str(sequence_service.nextval('oneauth', 'spaceId', 'na'))
        updated_record = db_utils.upsert(database_name, domain, data)
    return (200, {'data': updated_record})
