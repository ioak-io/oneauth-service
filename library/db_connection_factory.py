from pymongo import MongoClient
import os

MONGODB_URI = os.environ.get('MONGODB_URI')
if MONGODB_URI is None:
    MONGODB_URI = 'mongodb://localhost:27017'

__connection_map = {}

def get_collection(space_id, collection):
    if space_id not in __connection_map.keys():
        __connection_map[space_id] = MongoClient(MONGODB_URI)[space_id]
    return __connection_map.get(space_id)[collection]

def drop_database(space_id):
    MongoClient(MONGODB_URI).drop_database(space_id)

