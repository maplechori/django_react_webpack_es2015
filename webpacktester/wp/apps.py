from django.apps import AppConfig


class WpConfig(AppConfig):
    name = 'wp'

    def ready(self):
        from . import signals
