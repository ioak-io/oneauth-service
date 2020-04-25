import jwt

def decode(token):
    return jwt.decode(token, 'jwtsecret', algorithms=['HS256'])