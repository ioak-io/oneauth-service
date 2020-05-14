import library.db_utils as db_utils

self_space = 'oneauth'
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