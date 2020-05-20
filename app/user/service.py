import library.db_utils as db_utils

domain="user"

def get_user_by_email(space_id, email):
    return db_utils.find(space_id, domain, {'email': email})

def get_user_by_id(space_id, id):
    return db_utils.find(space_id, domain, {'_id': id})

def update_profile(space_id, data, user_id):
    user_list = db_utils.find(space_id, domain, {'_id': user_id, 'emailConfirmation': True})
    if len(user_list) < 1:
        return (404, {'data': 'user does not exist'})
    else:
        user = user_list[0]
        if 'firstName' in data:
            user['firstName'] = data['firstName']
        if 'lastName' in data:
            user['lastName'] = data['lastName']
        db_utils.upsert(space_id, domain, user)
        return (200, {'data': 'profile updated'})