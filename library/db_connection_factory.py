from pymongo import MongoClient
import os

DATABASE_URI = os.environ.get('DATABASE_URI')
if DATABASE_URI is None:
    DATABASE_URI = 'mongodb://localhost:27017'

__connection_map = {}

def get_collection(space, collection):
    if space not in __connection_map.keys():
        __connection_map[space] = MongoClient(DATABASE_URI)[space]
    return __connection_map.get(space)[collection]