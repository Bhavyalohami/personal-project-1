from datetime import timedelta, datetime
from django.utils import timezone
from DrConsult.models import SlotGenerationSetting, DefaultSlot, DateSlotModel, SubSlotModel
import logging

cron_logger = logging.getLogger('cron_logger')

def generate_slots_for_doctor():
    cron_logger.info("Cron job triggered: Generating slots... inside generate slots")
    try:
        today = timezone.now().date()
        settings = SlotGenerationSetting.objects.all()

        # Check if settings exist
        if not settings:
            cron_logger.error("No slot generation settings found")
            return

        for setting in settings:
            try:
                cron_logger.info(f"Processing settings for doctor: {setting.doctor}")

                # Check if the check_days flag is enabled
                if setting.check_days:
                    cron_logger.info(f"Check days enabled for doctor: {setting.doctor}")

                    # Auto-generate logic
                    if setting.auto_generate:
                        cron_logger.info(f"Auto-generate enabled for doctor: {setting.doctor}")
                        if setting.last_generated_at is None:
                            current_date = timezone.now().date()
                            cron_logger.info(f"First-time generation for doctor: {setting.doctor} from {current_date}")
                        else:
                            
                            current_date = setting.last_generated_at.date() + timedelta(days=1)
                            cron_logger.info(f"Continuing slot generation for doctor: {setting.doctor} from {current_date}")

                        end_date = current_date + timedelta(days=setting.number_of_days)
                        cron_logger.info(f"Generating slots until: {end_date} for doctor: {setting.doctor}")
                    else:
                        current_date = timezone.now().date()
                        end_date = current_date + timedelta(days=setting.number_of_days)
                        cron_logger.info(f"Manual generation until: {end_date} for doctor: {setting.doctor}")

                else:
                    current_date = timezone.now().date()

                    # Ensure until_date is not None
                    if setting.until_date is None:
                        cron_logger.error(f"Error: setting.until_date is None for doctor {setting.doctor}")
                        continue  # Skip this iteration if until_date is None
                    end_date = setting.until_date
                    cron_logger.info(f"Generating slots until specific date: {end_date} for doctor: {setting.doctor}")

                # Slot generation logic
                cron_logger.info(f"{current_date, end_date} from task.pyyy")
                if current_date == today:
                    cron_logger.info(f"Generating slots for today for doctor: {setting.doctor}")
                    while current_date < end_date:
                        day_of_week = current_date.strftime('%A')
                        cron_logger.info(f"Generating slots for {day_of_week} ({current_date}) for doctor: {setting.doctor}")

                        # Fetch default slots for the doctor on the given day
                        default_slots = DefaultSlot.objects.filter(doctor=setting.doctor, day_of_week=day_of_week)
                        if not default_slots:
                            cron_logger.info(f"No default slots found for {day_of_week} for doctor: {setting.doctor}")
                            current_date += timedelta(days=1)
                            continue

                        for slot in default_slots:
                            date_slot, created = DateSlotModel.objects.get_or_create(
                                doctor=slot.doctor,
                                date=current_date,
                                start_time=slot.start_time,
                                end_time=slot.end_time,
                                duration=slot.duration,
                                is_active=True
                            )
                            cron_logger.info(f"Slot generated for {slot.start_time} - {slot.end_time} on {current_date} for doctor: {slot.doctor}")

                            # Generate sub-slots
                            generate_sub_slots(date_slot)

                        current_date += timedelta(days=1)

                    # Update the last_generated_at field
                    setting.last_generated_at = end_date
                    setting.save()
                    cron_logger.info(f"Slot generation complete for doctor: {setting.doctor}, last generated date: {end_date}")

                elif current_date == today + timedelta(days=3):
                    cron_logger.info(f"Generating slots for 3 days later for doctor: {setting.doctor}")
                    while current_date < end_date:
                        day_of_week = current_date.strftime('%A')
                        default_slots = DefaultSlot.objects.filter(doctor=setting.doctor, day_of_week=day_of_week)

                        if not default_slots:
                            cron_logger.info(f"No default slots found for {day_of_week} for doctor: {setting.doctor}")
                            current_date += timedelta(days=1)
                            continue

                        for slot in default_slots:
                            date_slot, created = DateSlotModel.objects.get_or_create(
                                doctor=slot.doctor,
                                date=current_date,
                                start_time=slot.start_time,
                                end_time=slot.end_time,
                                duration=slot.duration,
                                is_active=True
                            )
                            cron_logger.info(f"Slot generated for {slot.start_time} - {slot.end_time} on {current_date} for doctor: {slot.doctor}")

                            # Generate sub-slots
                            generate_sub_slots(date_slot)

                        current_date += timedelta(days=1)

                    # Update the last_generated_at field
                    setting.last_generated_at = end_date
                    setting.save()
                    cron_logger.info(f"Slot generation complete for doctor: {setting.doctor}, last generated date: {end_date}")

            except Exception as e:
                cron_logger.error(f"Error processing settings for doctor {setting.doctor}: {str(e)}")
                continue  # Continue with the next doctor

    except Exception as e:
        cron_logger.error(f"Error in slot generation process: {str(e)}")


def generate_sub_slots(date_slot):
    """
    Generate sub-slots for the DateSlotModel based on the duration.
    """
    start_time = date_slot.start_time
    end_time = date_slot.end_time
    duration = date_slot.duration

    current_time = start_time

    while current_time < end_time:
        sub_slot_end = (datetime.combine(datetime.today(), current_time) + timedelta(minutes=duration)).time()
        if sub_slot_end > end_time:
            break  

        SubSlotModel.objects.create(
            date_slot=date_slot,
            start_time=current_time,
            end_time=sub_slot_end,
            is_active=True,
            is_booked=False
        )

        current_time = sub_slot_end
