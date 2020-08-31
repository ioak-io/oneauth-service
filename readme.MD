# Start Server locally

## First time

- pip install virtualenv
- pip install virtualenvwrapper-win

- mkvirtualenv oneauth
- pip install -r requirements.txt
- python manage.py runserver 8020

## Every time

- workon oneauth
- python manage.py runserver 8020

## Procfile Honcho for celery

web: gunicorn oneauth.wsgi --log-file
worker1: celery -A oneauth beat -l info
worker2: celery -A oneauth worker -l info
