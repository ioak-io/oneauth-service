from pymongo import MongoClient
import os

DATABASE_URI = os.environ.get('DATABASE_URI')
if DATABASE_URI is None:
    DATABASE_URI = 'mongodb://localhost:27017'

__connection_map = {}

def get_collection(space_id, collection):
    if space_id not in __connection_map.keys():
        __connection_map[space_id] = MongoClient(DATABASE_URI)[space_id]
    return __connection_map.get(space_id)[collection]

def drop_database(space_id):
    MongoClient(DATABASE_URI).drop_database(space_id)

