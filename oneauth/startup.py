import app.sequence.service as sequence_service
from pathlib import Path
import app.email_template.service as email_template_service

static_dir = Path('static')

def run():
    if sequence_service.is_present(100, 'spaceId', 'na') == False:
        sequence_service.create_sequence(100, 'spaceId', 'na', 210, 1)

    confirm_email_link_existing_record = email_template_service.find_template('confirm_email_link')
    reset_password_link_existing_record = email_template_service.find_template('reset_password_link')

    if reset_password_link_existing_record == None:
        reset_password_link_content = open(static_dir / 'email_templates/reset_password_link.html', 'r').read().replace('\n', ' ')
        email_template_service.add_template('reset_password_link', reset_password_link_content)
        
    if confirm_email_link_existing_record == None:
        confirm_email_link_content = open(static_dir / 'email_templates/confirm_email_link.html', 'r').read().replace('\n', ' ')
        email_template_service.add_template('confirm_email_link', confirm_email_link_content)
