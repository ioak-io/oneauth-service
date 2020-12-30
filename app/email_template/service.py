import library.db_utils as db_utils

self_space = 100
domain = 'emailTemplate'

def compose_message(template_name, arg):
    record = db_utils.find(self_space, domain, {'name': template_name})
    if len(record) > 0:
        template = record[0]['value']
        message = template
        for key in arg:
            message = message.replace(key, arg[key])
        return message
    else:
        return ''

def find_template(template_name):
    results = db_utils.find(self_space, domain, {'name': template_name})
    if len(results) > 0:
        return results[0]
    else:
        return None

def add_template(template_name, value):
    outcome = db_utils.upsert(self_space, domain, {'name': template_name, 'value': value})
    return outcome
