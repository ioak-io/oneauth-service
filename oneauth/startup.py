import app.sequence.service as sequence_service

def run():
    if sequence_service.is_present(100, 'spaceId', 'na') == False:
        sequence_service.create_sequence(100, 'spaceId', 'na', 210, 1)
