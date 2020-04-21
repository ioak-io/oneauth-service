import os, datetime, time
from pymongo import MongoClient
import secrets, jwt
import library.db_utils as db_utils
from Crypto.Hash import SHA256
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from base64 import b64encode, b64decode
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes
import library.jwt_utils as jwt_utils

DATABASE_URI = os.environ.get('DATABASE_URI')

domain="user"
domain_session="session"

def do_signup(space_id, data):
    solution = secrets.token_hex(80)
    data['solution'] = solution
    cipher_data = encrypt(solution, data['password'])
    data['iv'] = b64encode(cipher_data[0]).decode()
    data['salt'] = cipher_data[1]
    data['cipher'] = b64encode(cipher_data[2]).decode()
    data['hash'] = hash(solution)
    del data['password']
    user = db_utils.upsert(space_id, domain, data)
    return (200, {'data': user})

def do_authorize(space_id, data):
    user_list = db_utils.find(space_id, domain, {'email': data.get('email')})
    if len(user_list) == 0:
        return (404, {})
    else:
        user = user_list[0]
        try:
            decoded_text = decrypt(user['cipher'], user['salt'], data['password'], user['iv'])
        except:
            return (401, {'data': 'unauthorized'})
        if hash(decoded_text) == user['hash']:
            session_list = db_utils.find(space_id, domain_session, {'userId': user['_id']})
            if len(session_list) == 0:
                auth_key = secrets.token_hex(40)
                print(user)
                db_utils.upsert(space_id, domain_session, {
                    'key': auth_key,
                    'token': jwt.encode({
                        'userId': str(user.get('_id')),
                        'firstName': user.get('firstName'),
                        'lastName': user.get('lastName'),
                        'email': user.get('email'),
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
                        }, 'jwtsecret').decode('utf-8'),
                    'userId': user['_id']
                })
            else:
                auth_key = session_list[0]['key']
            return (200, {'auth_key': auth_key})
        else:
            return (401, {'data': 'unauthorized'})

def get_session_token(space_id, auth_key):
    session_list = db_utils.find(space_id, domain_session, {'key': auth_key})
    if len(session_list) == 0:
        return (404, {'data': 'not found'})
    else:
        session = session_list[0]
        return (200, {
            'token': session['token']
        })

def get_session(space_id, auth_key):
    session_list = db_utils.find(space_id, domain_session, {'key': auth_key})
    if len(session_list) == 0:
        return (404, {'data': 'not found'})
    else:
        session = session_list[0]
        content = jwt_utils.decode(session['token'])
        content['token'] = session['token']
        return (200, content)

def encrypt(text, password):
    salt = secrets.token_hex(80)
    iv = get_random_bytes(16)
    key = PBKDF2(password, salt, dkLen=32)    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphered_data = cipher.encrypt(pad(text.encode(), 16))
    decrypt_direct(ciphered_data, salt, password, iv)
    return (iv, salt, ciphered_data)

def decrypt(cipher_text, salt, password, iv):
    return decrypt_direct(b64decode(cipher_text.encode()), salt, password, b64decode(iv.encode()))

def decrypt_direct(cipher_text, salt, password, iv):
    key = PBKDF2(password, salt, dkLen=32)    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(cipher_text)
    encoded_data = unpad(padded_data, 16)
    return encoded_data.decode()

def hash(text):
    return b64encode(SHA256.new(text.encode()).digest()).decode()

def get_all_users(request):
    data = db_utils.find('oneauth' , domain, {})
    return ('200', {'data': data})