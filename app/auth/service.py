import os, datetime, time
from pymongo import MongoClient
import secrets, jwt
from library.db_connection_factory import get_collection
import library.db_utils as db_utils

DATABASE_URI = os.environ.get('DATABASE_URI')

domain="user"

def generate_keys():
    return (200, {
        'salt': secrets.token_hex(40),
        'solution': secrets.token_hex(40)
    })

def get_keys(space, email):
    user = get_collection(space, 'user').find_one({'email': email})
    #user = db_utils.find(space,domain,{'email': email})
    if user is None:
        return (404, {})
    else:
        return (200, {'problem': user.get('problem')})

def do_signup(space, data):
    print(data)
    #user = get_collection(space, 'user').insert_one(data)
    user = db_utils.upsert(space, domain, data)
    #return (200, {'_id': str(user.inserted_id)})
    return (200, {'_id': user})

def do_signin(space, data):
    user = get_collection(space, 'user').find_one({'email': data.get('email')})
    #user = db_utils.find(space, domain, {'email': data.get('email')})
    #response = {'content': {}}
    if user is None:
        return (404, {})
    elif user.get('solution') != data.get('solution'):
        return (401, {})
    elif user.get('solution') == data.get('solution'):
        return (200, {
            'name': user.get('name'),
            'email': user.get('email'),
            'token': jwt.encode({
                'userId': str(user.get('_id')),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
                }, 'jwtsecret').decode('utf-8'),
            'space': space,
            'secret': 'none'
        })

def do_jwttest(space):
    space=get_collection('appnamehere', 'space').find_one({'name': space})
    #space = db_utils.find(space, domain,{'name': space})
    jwtPassword = space.get('jwtPassword')
    return (200, jwt.encode({
            'userId': '4587439657496t',
            'name': 'test user display name',
            'email': 'q1@1.com',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }, jwtPassword, algorithm='HS256').decode('utf-8'))

def do_signin_via_jwt(space, data):
    spaceData=get_collection('appnamehere', 'space').find_one({'name': space})
    #spaceData = db_utils.find(space, domain, {'name': space})
    jwtPassword = spaceData.get('jwtPassword')
    jwtToken = data.get('jwtToken')
    tokenData = jwt.decode(jwtToken, jwtPassword, algorithm='HS256')
    user = get_collection(space, 'user').find_one({'email': tokenData.get('email')})
    #user = db_utils.find(space, domain,{'email': tokenData.get('email')})
    if user is None:
        """ get_collection(space, 'user').insert_one({
            'name': tokenData.get('name'),
            'email': tokenData.get('email'),
            'type': 'JWT_USER'
        }) """
        db_utils.upsert(space, domain,{
            'name': tokenData.get('name'),
            'email': tokenData.get('email'),
            'type': 'JWT_USER'
        })
    else:
        """ get_collection(space, 'user').update({'_id': user.get('_id')},
        {
            'name': tokenData.get('name'),
            'email': tokenData.get('email'),
            'type': 'JWT_USER'
        }, upsert=True) """
        db_utils.upsert(space, domain, {
            {'_id': user.get('_id')},
            {
                'name': tokenData.get('name'),
                'email': tokenData.get('email'),
                'type': 'JWT_USER'
            }
        })
    
    user = get_collection(space, 'user').find_one({'email': tokenData.get('email')})
    #user = db_utils.find(space, user, {'email': tokenData.get('email')})
    return (200, {
        'name': user.get('name'),
        'email': user.get('email'),
        'token': jwt.encode({
                'name': str(user.get('_id')),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
            }, jwtPassword, algorithm='HS256').decode('utf-8'),
        'space': space,
        'secret': 'none'
    })

    # print(jwt.decode(en, 'secret', algorithms=['HS256']))
    # time.sleep(10)
    # print(jwt.decode(en, 'secret', algorithms=['HS256'], verify=False))
    # print(jwt.decode(en, 'secret', algorithms=['HS256']))
    # return jwt.encode({'some': 'payload', 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=30)}, 'secret', algorithm='HS256')
