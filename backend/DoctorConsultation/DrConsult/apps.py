from django.apps import AppConfig
class DrconsultConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'DrConsult'

    def ready(self):
        import DrConsult.signals 



