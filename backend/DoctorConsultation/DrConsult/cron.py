# from django_cron import CronJobBase, Schedule

# from django_cron.models import CronJobLog
# from datetime import timedelta
# from django.utils import timezone

# class SlotGenerationCronJob(CronJobBase):
#     RUN_EVERY_MINS = 1440  # Run once a day

#     schedule = Schedule(run_every_mins=RUN_EVERY_MINS)

#     code = 'DrConsult.slot_generation_cron_job'

#     def do(self):

#         print("Cron job triggered: Generating slots...")
#         generate_slots_for_doctor()
#         print("Slot generation complete.")
#         clear_old_cron_logs()

#     def clear_old_cron_logs():
#         time_limit = timezone.now() - timedelta(days=1)
#         CronJobLog.objects.filter(end_time__lt=time_limit).delete()
#         print("Old cron logs cleared.")
from DrConsult.tasks import generate_slots_for_doctor
import logging
cron_logger = logging.getLogger('cron_logger')
def execute_cron_job():
    print("Cron job triggered: Generating slots...")
    cron_logger.info("Cron job triggered: Generating slots...")
    generate_slots_for_doctor()
   
    cron_logger.info("Slot generation complete.")
    