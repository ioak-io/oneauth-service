import app.sequence.service as sequence_service

def run():
    if sequence_service.is_present('oneauth', 'spaceId', 'na') == False:
        sequence_service.create_sequence('oneauth', 'spaceId', 'na', 210, 1)
