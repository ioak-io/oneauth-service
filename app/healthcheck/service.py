import os, datetime, time
from pymongo import MongoClient
import library.db_utils as db_utils
import library.db_connection_factory as db_connection_factory
from gridfs import GridFS
import base64
from bson.binary import Binary
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import secrets

DATABASE_URI = os.environ.get('DATABASE_URI')

domain = 'role'
database_name=100

def test_database():
    try:
        return db_connection_factory.get_client().server_info()
    except:
        return False
