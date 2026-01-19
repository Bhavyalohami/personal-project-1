from django.core.management.base import BaseCommand
from django_q.models import Schedule
from datetime import datetime, timedelta
import pytz 
class Command(BaseCommand):
    help = 'Schedule the task to generate slots daily'

    def handle(self, *args, **kwargs):
        
        if not Schedule.objects.filter(func='DrConsult.tasks.generate_slots_for_doctor').exists():
            now = datetime.now(pytz.timezone('Asia/Kolkata'))
            three_pm= now.replace(hour=15, minute=0, second=0, microsecond=0)
            print(three_pm)
            Schedule.objects.create(
                func='DrConsult.tasks.generate_slots_for_doctor', 
                schedule_type=Schedule.DAILY,  
                next_run=three_pm+timedelta(days=1),  
            )
            self.stdout.write(self.style.SUCCESS('Scheduled the task to generate slots daily.'))
        else:
            self.stdout.write(self.style.WARNING('The task is already scheduled.'))
