import library.db_utils as db_utils

domain="user"

def get_user_by_email(space_id, email):
    return db_utils.find(space_id, domain, {'email': email})
