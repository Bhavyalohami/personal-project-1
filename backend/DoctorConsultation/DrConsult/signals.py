# DrConsult/signals.py
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Booking, Notification,Staff,CancelledBooking,CustomUser,Patient,VendorUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Signal to handle appointment bookings


@receiver(post_save, sender=Booking)
def send_booking_notification(sender, instance, created, **kwargs):
    try:
        if created:
            message = (
                f"New appointment booked for {instance.date} at {instance.time} with Dr. "
                f"{instance.doctor} by {instance.name}."
            )
            Notification.objects.create(doctor=instance.username, message=message, notification_type="Booking")
            send_notification(instance.username, message)
        else:
            if instance.status == "confirmed":
                return  
            else:
                message = (
                    f"Appointment for {instance.date} at {instance.time} with Dr. "
                    f"{instance.doctor} is cancelled."
                )
                Notification.objects.create(doctor=instance.username, message=message, notification_type="cancelled")
                send_notification(instance.username, message)
            
    except TypeError as e:
        print(f"TypeError in send_booking_notification: {e}")
    except Exception as e:
        print(f"Unexpected error in send_booking_notification: {e}")


# Function to send notification using Django Channels
def send_notification(doctor, message):
    channel_layer = get_channel_layer()
    group_name = f'doctor_{doctor}'  
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'message': message
        }
    )

@receiver(post_save, sender=CustomUser)
def create_user_profiles(sender, instance, created, **kwargs):
    if created:
        if instance.is_vendor and not instance.is_staff and not instance.is_superuser:
            VendorUser.objects.create(
                username=instance,  
                email=instance.email,
                fname=instance.first_name,
                lname=instance.last_name
            )
        elif instance.is_staff and instance.is_vendor:
            VendorUser.objects.create(
                username=instance,  
                email=instance.email,
                fname=instance.first_name,
                lname=instance.last_name
            )
            Staff.objects.create(
                username=instance,  
                email=instance.email,
                fname=instance.first_name,
                lname=instance.last_name,
                # is_staff= instance.is_staff,
            )

        elif not instance.is_superuser and not instance.is_staff and not instance.is_vendor:
            Patient.objects.create(
                username=instance,  # Use `username` to match the field in Patient
                email=instance.email
            )