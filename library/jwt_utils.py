import jwt

def decode(token):
    try:
        return jwt.decode(token, 'jwtsecret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
