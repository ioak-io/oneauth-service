from celery import Celery
import os
import appnamehere.settings as settings

# Setting the Default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE','appnamehere.settings')
app=Celery('appnamehere')

# Using a String here means the worker will always find the configuration information
app.config_from_object('django.conf:settings')
# app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
