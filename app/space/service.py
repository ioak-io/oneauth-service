import os, datetime, time
from pymongo import MongoClient
from library.db_connection_factory import get_collection
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'space'
database_name = 'oneauth'

def do_create(data_in):
    space = get_collection(database_name, domain).insert_one(data_in)
    return (200, {'_id': str(space.inserted_id)})

def do_get_space(space):
    spaceData = get_collection(database_name,domain).find_one({'name': space})
    spaceData['_id'] = str(spaceData['_id'])
    return (200, spaceData)

def do_update_space(space,data):
    spaceData = get_collection(database_name,domain).find_one({'name': space})
    get_collection(database_name,domain).update_one({
        '_id' : (spaceData['_id'])
    },{
        '$set':{
            'stage':data['data']
        }
    },upsert=True )
    return (200, None)
