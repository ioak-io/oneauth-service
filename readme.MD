# Start Server locally

## First time

- pip install virtualenv
- pip install virtualenvwrapper-win
- pip install -r requirements.txt
- mkvirtualenv <some name for the environment> (eg: mkvirtualenv local)
- python manage.py runserver

## Every time

- workon <environment name> (eg: workon local)
- python manage.py runserver

## Procfile Honcho for celery

web: gunicorn oneauth.wsgi --log-file
worker1: celery -A oneauth beat -l info
worker2: celery -A oneauth worker -l info
