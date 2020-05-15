import os, time, uuid, datetime
from pymongo import MongoClient
from google.oauth2 import id_token
from google.auth.transport import requests
import secrets, jwt
import library.db_utils as db_utils
from Crypto.Hash import SHA256
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from base64 import b64encode, b64decode
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes
import library.jwt_utils as jwt_utils
import library.mail_utils as mail_utils
import app.email_template.service as email_template_service

DATABASE_URI = os.environ.get('DATABASE_URI')

domain="user"
domain_session="session"
domain_passwordresetcode="passwordResetCode"
domain_emailconfirmationcode="emailConfirmationCode"

def do_signup(space_id, data):
    existing_user = db_utils.find(space_id, domain, {'email': data['email']})
    if len(existing_user) > 0:
        return (403, {'data': 'user already present'})
    else:
        data_to_add = get_user_with_auth_data(data)
        data_to_add['emailConfirmation'] = False
        user = db_utils.upsert(space_id, domain, data_to_add)
        send_email_confirmation_link(space_id, user)
        return (200, {'data': user})

def get_user_with_auth_data(data):
    solution = secrets.token_hex(80)
    data['solution'] = solution
    cipher_data = encrypt(solution, data['password'])
    data['iv'] = b64encode(cipher_data[0]).decode()
    data['salt'] = cipher_data[1]
    data['cipher'] = b64encode(cipher_data[2]).decode()
    data['hash'] = hash(solution)
    del data['password']
    return data

def change_password(space_id, data, user_id):
    user_list = db_utils.find(space_id, domain, {'_id': user_id, 'emailConfirmation': True})
    if len(user_list) < 1:
        return (404, {'data': 'user does not exist'})
    else:
        user = user_list[0]
        try:
            decoded_text = decrypt(user['cipher'], user['salt'], data['oldPassword'], user['iv'])
        except:
            return (401, {'data': 'unauthorized'})
        if hash(decoded_text) == user['hash']:
            user['password'] = data['newPassword']
            auth_user_data = get_user_with_auth_data(user)
            db_utils.upsert(space_id, domain, auth_user_data)
            return (200, {'data': 'password updated'})
        else:
            return (401, {'data': 'unauthorized'})

def reset_password_link(space_id, data):
    user_record = db_utils.find(space_id, domain, {'email': data['email'], 'emailConfirmation': True})
    if len(user_record) < 1:
        return (404, {'data': 'user does not exist'})
    else:
        db_utils.delete(space_id, domain_passwordresetcode, {'userId': user_record[0]['_id']})
        updated_record = db_utils.upsert(space_id, domain_passwordresetcode, {'userId': user_record[0]['_id']})
        message_body = email_template_service.compose_message('reset_password_link', {'TEMPLATE_AUTH_CODE': updated_record['_id'], 'TEMPLATE_USER_DISPLAY_NAME': user_record[0]['firstName'] + ' ' + user_record[0]['lastName']})
        mail_utils.send_mail(data['email'], "Link to reset your oneauth user account", message_body)
        return (200, {'data': 'password reset link sent'})

def email_confirmation_link(space_id, data):
    user_record = db_utils.find(space_id, domain, {'email': data['email']})
    if len(user_record) < 1:
        return (404, {'data': 'user does not exist'})
    elif user_record[0]['emailConfirmation']:
        return (200, {'data': 'email already confirmed'})
    else:
        send_email_confirmation_link(space_id, user_record[0])
        return (200, {'data': 'email confirmation link sent'})

def send_email_confirmation_link(space_id, user):
    db_utils.delete(space_id, domain_emailconfirmationcode, {'userId': user['_id']})
    updated_record = db_utils.upsert(space_id, domain_emailconfirmationcode, {'userId': user['_id']})
    message_body = email_template_service.compose_message('confirm_email_link', {'TEMPLATE_AUTH_CODE': updated_record['_id'], 'TEMPLATE_USER_DISPLAY_NAME': user['firstName'] + ' ' + user['lastName']})
    mail_utils.send_mail(user['email'], "Confirm your email to activate your oneauth user account", message_body)

def verify_email_confirmation_link(space_id, auth_code):
    reset_link = db_utils.find(space_id, domain_emailconfirmationcode, {'_id': auth_code})
    if len(reset_link) < 1:
        return (404, {'data': 'email confirmation link is invalid'})
    else:
        user_record = db_utils.find(space_id, domain, {'_id': reset_link[0]['userId']})
        if len(user_record) > 0:
            user = user_record[0]
            user['emailConfirmation'] = True
            db_utils.upsert(space_id, domain, user)
            return (200, {'data': 'email confirmed'})
        else:
            return (404, {'data': 'user not found'})

def verify_password_link(space_id, auth_code):
    reset_link = db_utils.find(space_id, domain_passwordresetcode, {'_id': auth_code})
    if len(reset_link) < 1:
        return (404, {'data': 'password reset code is invalid'})
    else:
        return (200, {'data': 'password reset link active'})

def reset_password(space_id, auth_code, data):
    reset_link = db_utils.find(space_id, domain_passwordresetcode, {'_id': auth_code})
    if len(reset_link) < 1:
        return (404, {'data': 'password reset code is invalid'})
    elif int((datetime.datetime.now() - reset_link[0]['createdAt']).total_seconds()) > (2*24*60*60):
        return (410, {'data': 'password reset code is expired'})
    else:
        user_data = db_utils.find(space_id, domain, {'_id': reset_link[0]['userId']})
        user_data[0]['password'] = data['password']
        auth_user_data = get_user_with_auth_data(user_data[0])
        db_utils.upsert(space_id, domain, auth_user_data)
        db_utils.delete(space_id, domain_passwordresetcode, {'userId': reset_link[0]['userId']})
        return (200, {'data': 'password updated'})

def do_authorize(space_id, data):
    user_list = db_utils.find(space_id, domain, {'email': data.get('email')})
    if len(user_list) == 0:
        return (404, {})
    else:
        user = user_list[0]
        if user['emailConfirmation'] == False:
            return (403, {'data': 'Email not confirmed'})
        try:
            decoded_text = decrypt(user['cipher'], user['salt'], data['password'], user['iv'])
        except:
            return (401, {'data': 'unauthorized'})
        if hash(decoded_text) == user['hash']:
            # session_list = db_utils.find(space_id, domain_session, {'userId': user['_id']})
            # if len(session_list) == 0:
            # else:
            #     auth_key = session_list[0]['key']
            auth_key = create_session(space_id, user)
            return (200, {'auth_key': auth_key})
        else:
            return (401, {'data': 'unauthorized'})

def create_session(space_id, user):
    auth_key = secrets.token_hex(40)
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
    return auth_key

def do_authorize_google(space_id, token):
    print(token)
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), "81306451496-fg67eb502dvfb50c31huhkbn481bi29h.apps.googleusercontent.com")
        print(idinfo)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        existing_user = db_utils.find(space_id, domain, {'email': idinfo['email']})
        if len(existing_user) < 1:
            updated_user = db_utils.upsert(space_id, domain, {'firstName': idinfo['given_name'], 'lastName': idinfo['family_name'], 'email': idinfo['email'], 'emailConfirmation': True})
        else:
            updated_user = db_utils.upsert(space_id, domain, {'_id': existing_user[0]['_id'], 'firstName': idinfo['given_name'], 'lastName': idinfo['family_name'], 'email': idinfo['email'], 'emailConfirmation': True})
        auth_key = create_session(space_id, updated_user)
        return (200, {'auth_key': auth_key})

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # userid = idinfo['sub']
    except ValueError:
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
        if content == None:
            return (401, {'data': 'session expired'})
        else:
            content['token'] = session['token']
            print(content)
            return (200, content)

def invalidate_session_token(space_id, auth_key):
    result = db_utils.delete(space_id, domain_session, {'key': auth_key})
    if result.deleted_count > 0:
        return (200, {'data': 'session invalidated'})
    else:
        return (404, {'data': 'no matching session'})

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