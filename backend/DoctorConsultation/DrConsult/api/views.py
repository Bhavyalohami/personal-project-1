import random
import string
from ..models import *
from .serializers import *  
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from rest_framework import viewsets
from django.db.models import JSONField
from datetime import datetime, timedelta, time
from django.utils.timezone import now
from django.core.mail import send_mail
from django.conf import settings
from django.utils.dateparse import parse_date
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.contrib.staticfiles import finders
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage
from twilio.rest import Client
from rest_framework import generics , status,permissions
from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.db import models, transaction
from django.utils.dateparse import parse_time
from rest_framework.generics import GenericAPIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from DrConsult.tasks import generate_slots_for_doctor
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.serializers import serialize
import json
from datetime import date
from django.db.models import Q
from django.utils.decorators import method_decorator
from .decorators import superuser_required
# from DrConsult.models import CustomUser
from django.db.models import Avg
from DrConsult.page_config import ROLES, SUBROLES
from django.contrib.auth import get_user_model
from django.db.models import Avg, Q
import stripe


def index_view(request):
    return JsonResponse({'status': 'success', 'message': 'Working ✅'})


CustomUser = get_user_model()
class ContactList(generics.ListCreateAPIView):
    queryset = Contact.objects.all().order_by('-id')
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
class DeleteContact(generics.RetrieveDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

class ConsultationQuery(generics.ListCreateAPIView):
    queryset = ConsultationQueryM.objects.all().order_by('-id')
    serializer_class = ConsultationQuerySerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        booking = serializer.save()
        email = SetupNotificationsDetails.objects.first().email
        self.send_querry_confirmation_email(booking, email)
    
    def send_querry_confirmation_email(self, booking, email):
        subject = 'Consultation Request Received – Dr.Consultation'
    
        html_message = render_to_string('drconsult/consultation_query_email.html', {'booking': booking})
    
        plain_message = strip_tags(html_message)
        recipient_list = [booking.email]
        from_email = email

    
        email = EmailMultiAlternatives(
         subject=subject,
         body=plain_message,
         from_email=from_email,
         to=recipient_list
    )
        email.attach_alternative(html_message, "text/html")
        logo_path = finders.find("drconsult/logo.png")
        with open(logo_path, 'rb') as img:
            logo = MIMEImage(img.read())
            logo.add_header('Content-ID', '<logo>')
            email.attach(logo)
        email.send(fail_silently=False)
       


class DelQuery(generics.RetrieveDestroyAPIView):
    queryset = ConsultationQueryM.objects.all()
    serializer_class = ConsultationQuerySerializer
    permission_classes = [AllowAny]

class ServicesView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Services.objects.all().order_by('-id')
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny ]

    def create(self, request, *args, **kwargs):
        service_name = request.data.get('name')
        if Services.objects.filter(name=service_name).exists():
            return Response(
                {"error": "Service already exists", "status_code": 409},
                status=status.HTTP_200_OK
            )
        return super().create(request, *args, **kwargs)


    def patch(self, request, *args, **kwargs):
        staff_id = self.kwargs.get('id')
        try:
            service = Services.objects.get(id=staff_id)
        except service.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        # Toggle the status
        current_status = service.status
        new_status = 0 if current_status == 1 else 1
        service.status = new_status
        service.save()

        # Return the updated staff object
        serializer = self.get_serializer(service)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Use the default behavior to create the new service
        response = super().post(request, *args, **kwargs)
        
        # Modify the response to return status code 200
        return Response(response.data, status=status.HTTP_200_OK)

class LatestServicesView(generics.ListAPIView):
    queryset = Services.objects.all().order_by('-id')[:6]
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny]

class ServiceDetailView(generics.RetrieveUpdateAPIView):
    queryset = Services.objects.all().order_by('-id')
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        mutable_data = request.data.copy()

        if "image" not in request.FILES and "image" in mutable_data:

            mutable_data.pop("image", None)

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ServiceDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny]

class BlogsView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Blogs.objects.all().order_by('-id')
    serializer_class = BlogsSerializer
    permission_classes = [AllowAny]

class BlogDetailView(generics.RetrieveUpdateAPIView):
    queryset = Blogs.objects.all().order_by('-id')
    serializer_class = BlogsSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        mutable_data = request.data.copy()

        if "image" not in request.FILES and "image" in mutable_data:

            mutable_data.pop("image", None)

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Blogs.objects.all()
    serializer_class = BlogsSerializer
    permission_classes = [AllowAny]

class StaffToggleStatusView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    def patch (self, request, *args, **kwargs):
        staff_id = request.data.get('staff_id')
        current_status = request.data.get('current_status')
        try:
            staff_username = Staff.objects.get(id=staff_id).username
            user = CustomUser.objects.get(username=staff_username)
            user.is_active = not current_status
            user.save()
            return Response(
                {"message": "User status updated successfully"},
                status=status.HTTP_200_OK,
            )
        except Staff.DoesNotExist:
            return Response(
                {"error": "Staff not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
class StaffView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Staff.objects.all().order_by('-id')
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        staff_id = self.kwargs.get('id')
        try:
            staff = Staff.objects.get(id=staff_id)
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        # Toggle the status
        current_status = staff.status
        new_status = 0 if current_status == 1 else 1
        staff.status = new_status
        staff.save()

        # Return the updated staff object
        serializer = self.get_serializer(staff)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, *args, **kwargs):
        staff_queryset = self.get_queryset()
        staff_data = []

        # Fetch the `is_active` status for each staff from the User table
        for staff in staff_queryset:
            user = CustomUser.objects.filter(username=staff.username).first()
            is_active = user.is_active if user else False

            # Serialize the staff data and include `is_active` status
            serialized_staff = self.get_serializer(staff).data
            serialized_staff['is_active'] = is_active
            staff_data.append(serialized_staff)

        return Response(staff_data, status=status.HTTP_200_OK)

class SingleStaffView(generics.RetrieveUpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [AllowAny] 
    lookup_field = "username"

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)  
        instance = self.get_object()
        mutable_data = request.data.copy()
        if "image" not in request.FILES and "image" in mutable_data:
            mutable_data.pop("image", None)
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StaffDetailView(generics.RetrieveUpdateAPIView):
    
    queryset = Staff.objects.all().order_by('-id')
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        mutable_data = request.data.copy()

        if "image" not in request.FILES and "image" in mutable_data:

            mutable_data.pop("image", None)

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class StaffDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]


    def delete(self, request, *args, **kwargs):
       
        staff = self.get_object()
        username = staff.username 
        if staff.is_staff:
            try:
                user = CustomUser.objects.get(username=username)
                user.delete() 
            except CustomUser.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        staff.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class DoctorBookingView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Booking.objects.all().order_by('-id')
        username = self.kwargs.get('username')
        if username:
            queryset = queryset.filter(username__icontains=username)
        return queryset

class BookingView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):

        booking = serializer.save()
        sub_slot_id = self.request.data.get('sub_slot')
        email = Configuration.objects.first().email_address
        phoneno = Configuration.objects.first().contact_number
        
        if sub_slot_id:
            try:
                sub_slot = SubSlotModel.objects.get(id=sub_slot_id)
                if sub_slot.is_booked:
                    raise ValidationError("This slot is already booked.")
                sub_slot.is_booked = True
                sub_slot.save()
                booking.sub_slot = sub_slot
                # booking.save()
            except SubSlotModel.DoesNotExist:
                raise ValidationError("SubSlot does not exist.")

        user = self.request.user
        
        if user.is_authenticated:
            id = user.id
            patient_instance=Patient.objects.get(username_id=id)
            booking.patient=patient_instance
            booking.is_patient = True

        booking.save()
        self.send_booking_confirmation_email(booking,email)
        self.send_doctor_confirmation_email(booking,email)
        self.send_appointment_confirmation_sms(booking,phoneno)
        self.send_doctor_appointment_confirmation_sms(booking,phoneno)
        print(booking.id,"booking_iddd"),
        return Response({
            
            'booking_id': booking.id,
            'message': 'Booking created successfully.'
        }, status=status.HTTP_201_CREATED)
        


    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_vendor:
            queryset = Booking.objects.all().order_by('-id')
        elif user.is_staff and not user.is_vendor:
            queryset = Booking.objects.filter(username__icontains=user.username).order_by('-id')
        else:
            queryset = Booking.objects.none()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        today = now().date()


        todays_appointments = Booking.objects.filter(date__icontains=today, status__icontains='confirmed')
        todays_appointments_data = [
            {'id': record['pk'], **record['fields']}
            for record in json.loads(serialize('json', todays_appointments))
        ]

       
        cancelled_appointments = Booking.objects.filter(status__icontains='cancelled').order_by('-date')
        cancelled_appointments_data = [
            {'id': record['pk'], **record['fields']}
            for record in json.loads(serialize('json', cancelled_appointments))
        ]

       
        today_appointments_count = todays_appointments.count()
        total_appointments = Booking.objects.all().count()
        total_patients = Booking.objects.values('name').distinct().count()
        total_doctors = Staff.objects.all().count()

       
        locations = ManageLocation.objects.values('id', 'name')
        departments = ManageDepartment.objects.values('id', 'name')
        services = Services.objects.values('id', 'name')
        staff = Staff.objects.values('id', 'fname','lname', 'role','location','image')
        # staff_data = [
        # {
        #     "id": s["id"],
        #     "fname": s["fname"],
        #     "lname": s["lname"],
        #     "role": s["role"],
        #     "location": s["location"],
        #     "image": s["image"],
        # }
        # for s in staff
        # ]

     
        serializer = self.get_serializer(queryset, many=True)

       
        response_data = {
            "total_appointments": today_appointments_count,
            "total_appointments_count": total_appointments,
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "appointments": serializer.data,
            "todays_appointments": todays_appointments_data,
            "cancelled_appointments": cancelled_appointments_data,
            "locations": list(locations),  
            "departments": list(departments),  
            "services": list(services), 
            "staff": staff,  
        }

        return Response(response_data)
    
    def send_booking_confirmation_email(self, booking,email):
        subject = 'Appointment Confirmation'
   
        html_message = render_to_string('drconsult/booking_confirmation_email.html', {'booking': booking})
    
        plain_message = strip_tags(html_message)
        recipient_list = [booking.email]
        from_email = email

    
        email = EmailMultiAlternatives(
         subject=subject,
         body=plain_message,
         from_email=from_email,
         to=recipient_list
    )
        email.attach_alternative(html_message, "text/html")
        logo_path = finders.find("drconsult/logo.png")
        with open(logo_path, 'rb') as img:
            logo = MIMEImage(img.read())
            logo.add_header('Content-ID', '<logo>')
            email.attach(logo)
        email.send(fail_silently=False)

    def send_doctor_confirmation_email(self, booking,email):
        subject = 'New Appointment Scheduled'
        html_message = render_to_string('drconsult/doctor_confirmation_email.html', {'booking': booking})
   
        plain_message = strip_tags(html_message)
        try:
            staff_member = Staff.objects.get(username=booking.username)  
            doctor_email = staff_member.email
        except Staff.DoesNotExist:
            
            return
        
        from_email = email
        recipient_list = [doctor_email]

    # Create and send the email
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
    )
    
        email.attach_alternative(html_message, "text/html")
    
    # Attach logo
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
    
        email.send(fail_silently=False)
    
    def send_appointment_confirmation_sms(self, appointment_details,phoneno):
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        from_no = settings.TWILIO_PHONE_NUMBER


        message_body = f"Dear {appointment_details.name},\n\nYour appointment is confirmed for {appointment_details.date} at {appointment_details.time} with Dr. {appointment_details.doctor}."

        try:
            message = client.messages.create(
                body=message_body,
                from_='whatsapp:{phoneno}',
                to=f'whatsapp:+91{appointment_details.contact}'
            )
            # print("for client")
            return message.sid 
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None
        

    def send_doctor_appointment_confirmation_sms(self, appointment_details,phoneno):
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        from_no = settings.TWILIO_PHONE_NUMBER

        staff_member = Staff.objects.get(username=appointment_details.username)  
        phone = staff_member.phone
    
        message_body = f"Dear Dr. {appointment_details.doctor},\n\nYou have an appointment scheduled with {appointment_details.name} on {appointment_details.date} at {appointment_details.time}."

        try:
            message = client.messages.create(
                body=message_body,
                from_='whatsapp:{phoneno}',
                to=f'whatsapp:+91{appointment_details.contact}'
            )
            return message.sid  
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None

class BookingDetailView(generics.RetrieveUpdateAPIView):
    queryset = Booking.objects.all().order_by('-id')
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
            
            booking_instance = self.get_object()
            booking = Booking.objects.get(id=booking_instance.id)
            old_slot = booking.sub_slot
            old_date = booking.date
            old_doctor = booking.doctor
            email = SetupNotificationsDetails.objects.first().email

            
            if 'sub_slot' in request.data and request.data['sub_slot'] != old_slot.id:
                old_slot.is_booked = False
                old_slot.save()
            
            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(booking_instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            new_slot_id = request.data.get('sub_slot')
            new_slot = SubSlotModel.objects.get(id=new_slot_id) if new_slot_id else None
            new_date = request.data.get('date', booking.date)

            if new_slot and new_slot_id != old_slot.id:
                new_slot.is_booked = True
                new_slot.save()

            if old_date != new_date or old_slot.id != new_slot_id:
                self.send_websocket_notification(booking_instance, old_date, old_slot, new_date, new_slot)
                self.send_booking_rescheduling_email(booking_instance, old_slot,old_date,old_doctor,email)
                self.send_appointment_rescheduling_sms(booking_instance)

            return Response(serializer.data)
    
    def send_websocket_notification(self, booking_instance, old_date, old_slot, new_date, new_slot):
        
        message = (
            f"Appointment rescheduled from {old_date} at {old_slot.start_time} - {old_slot.end_time} "
            f"to {new_date} at {new_slot.start_time} - {new_slot.end_time} with Dr. {booking_instance.doctor}."
        )
        Notification.objects.create(doctor=booking_instance.username, message=message, notification_type="rescheduled")
        doctor = booking_instance.username
        
        channel_layer = get_channel_layer()
        group_name = f'doctor_{doctor}'
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "message": message,
            }
        )
    
    def send_booking_rescheduling_email(self, booking_instance, old_slot,old_date,old_doctor,email):
        subject = 'Appointment Rescheduled'
   
        html_message = render_to_string('drconsult/appointment_reschedule_email.html', {'booking': booking_instance, 'old_slot': old_slot, 'old_date': old_date, 'old_doctor': old_doctor})
    
        plain_message = strip_tags(html_message)
        recipient_list = [booking_instance.email]
        from_email = email

    
        email = EmailMultiAlternatives(
         subject=subject,
         body=plain_message,
         from_email=from_email,
         to=recipient_list
    )
        email.attach_alternative(html_message, "text/html")
        logo_path = finders.find("drconsult/logo.png")
        with open(logo_path, 'rb') as img:
            logo = MIMEImage(img.read())
            logo.add_header('Content-ID', '<logo>')
            email.attach(logo)
        email.send(fail_silently=False)

    def send_appointment_rescheduling_sms(self, booking_instance):
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        from_no = settings.TWILIO_PHONE_NUMBER


        message_body = (
        f"Dear {booking_instance.name},\n\n"
        "Your appointment has been successfully rescheduled. Here are the new details:\n"
        f"Date: {booking_instance.date}\n"
        f"Time: {booking_instance.time}\n"
        f"Doctor: Dr. {booking_instance.doctor}\n\n"
        "Thank you for your understanding!"
        )


        try:
            message = client.messages.create(
                body=message_body,
                from_='whatsapp:+14155238886',
                to=f'whatsapp:+91{booking_instance.contact}'
            )
            # print("for client")
            return message.sid 
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None
    

class BookingDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.sub_slot:
            try:
                sub_slot = instance.sub_slot
                sub_slot.is_booked = False
                sub_slot.save()  
            except SubSlotModel.DoesNotExist:
                raise ValidationError("SubSlot does not exist.")
        
        response = super().destroy(request, *args, **kwargs)

        return response

class LogoChangeView(generics.RetrieveUpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Configuration.objects.all()
    serializer_class = LogoChangeSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()
    
class FaviconChangeView(generics.RetrieveUpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Configuration.objects.all()
    serializer_class = FaviconChangeSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()

class TimingsView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = TimingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()

class SloganView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = SloganSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()
    
class AddressView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()

class SocialMediaView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = SocialMediaSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()

class ConfigurationsView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()
    

class AdminView(generics.RetrieveUpdateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        mutable_data = request.data.copy()

        if "image" not in request.FILES and "image" in mutable_data:

            mutable_data.pop("image", None)

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        return Admin.objects.first()
    

class RegisterStaffView(generics.CreateAPIView):
    # parser_classes = (MultiPartParser, FormParser)
    queryset = CustomUser.objects.all()
    serializer_class = RegisterStaffSerializer

    def perform_create(self, serializer):

        raw_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))  
        staff_member = serializer.save(password=raw_password, is_active=False)
        email = Configuration.objects.first().email_address
        
        try:
            staff = Staff.objects.get(username=staff_member.username)
            doctor_name = staff.fname + staff.lname  
        except Staff.DoesNotExist:
            doctor_name = 'Doctor'
        self.send_doctor_registration_email(staff_member, doctor_name, raw_password,email)

    def send_doctor_registration_email(self,staff_member,doctor_name, raw_password,email):
        
        subject = 'Activate your account'
        html_message = render_to_string('drconsult/doctor_registration_email.html', {
            'doctor_name': doctor_name,
            'username': staff_member.username,
            'password': raw_password,
            'activation_link': f'http://192.168.1.25:3000/authenticate/user/{staff_member.username}'
        })

        plain_message = strip_tags(html_message)

        try:
            
            staff = Staff.objects.get(username=staff_member.username)
            print(staff.email,"staff_email")  
            print(staff_member.email,"staff_member_email")
            doctor_email = staff.email
        except Staff.DoesNotExist:
            return
        
        from_email = email
        recipient_list = [doctor_email]

        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
        )
        
        email.attach_alternative(html_message, "text/html")
        
        
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
        
        email.send(fail_silently=False)


    
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [AllowAny]


    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        new_password = request.data.get("new_password")
        email = SetupNotificationsDetails.objects.first().email

        if not username or not new_password:
            return Response({"error": "Username and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)
            email = user.email
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()
        self.send_password_change_mail(username, new_password,email)
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    def send_password_change_mail(self,username,new_password,email):
        
        subject = 'Password Change'
        html_message = render_to_string('drconsult/changepassword.html', {
            'username': username,
            'new_password': new_password
        })
        plain_message = strip_tags(html_message)

        from_email = email
        to_email= email
        recipient_list = [to_email]

        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
        )
        
        email.attach_alternative(html_message, "text/html")
        
        
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
        
        email.send(fail_silently=False)


    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Update the session auth hash to avoid logging the user out
        update_session_auth_hash(request, user)

        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']


        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Incorrect username or password'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({'error': 'Please activate your account first to login'}, status=status.HTTP_403_FORBIDDEN)

        user = authenticate(username=username, password=password)
        print(user)
        if user is not None:

            Token.objects.filter(user=user).delete() 
            token, created = Token.objects.get_or_create(user=user)
            response_data = {
                'token': token.key,
                'username': user.username,
                'status': 'success',
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_vendor': user.is_vendor,
                'http_status_code': status.HTTP_200_OK, 
                'roles': user.roles,
                'subroles':user.subroles,
            }
            response = Response( response_data,status=status.HTTP_200_OK)
            expires_at = timezone.now() + timedelta(hours=5)  
            return response
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)




class ManagePagesView(generics.ListCreateAPIView):
    queryset = ManagePages.objects.all()
    serializer_class = ManagePagesSerializer
    permission_classes = [AllowAny]
    

class ManageSinglePageView(generics.RetrieveUpdateAPIView):
    queryset = ManagePages.objects.all()
    serializer_class = ManagePagesSerializer
    permission_classes = [AllowAny]    
    lookup_field = 'slug'

class ManageLocationView(generics.ListCreateAPIView):
    queryset = ManageLocation.objects.all()
    serializer_class = ManageLocationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        location_name = request.data.get('name')
        if ManageLocation.objects.filter(name=location_name).exists():
            return Response(
                {"error": "Location already exists", "status_code": 409},
                status=status.HTTP_200_OK
            )
        return super().create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        location_id = self.kwargs.get('id')
        try:
            location = ManageLocation.objects.get(id=location_id)
        except ManageLocation.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        current_status = location.status
        new_status = 0 if current_status == 1 else 1
        location.status = new_status
        location.save()

        serializer = self.get_serializer(location)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LocationDetailView(generics.RetrieveUpdateAPIView):
    queryset = ManageLocation.objects.all().order_by('-id')
    serializer_class = ManageLocationSerializer
    permission_classes = [AllowAny]


class LocationDeleteView(generics.RetrieveDestroyAPIView):
    queryset = ManageLocation.objects.all()
    serializer_class = ManageLocationSerializer
    permission_classes = [AllowAny]

class ManageDepartmentView(generics.ListCreateAPIView):
    queryset = ManageDepartment.objects.all()
    serializer_class = ManageDepartmentSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        department_name = request.data.get('name')
        if ManageDepartment.objects.filter(name=department_name).exists():
            return Response(
                {"error": "Department already exists", "status_code": 409},
                status=status.HTTP_200_OK
            )
        return super().create(request, *args, **kwargs)


    def patch(self, request, *args, **kwargs):
        department_id = self.kwargs.get('id')
        try:
            department = ManageDepartment.objects.get(id=department_id)
        except ManageDepartment.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)


        current_status = department.status
        new_status = 0 if current_status == 1 else 1
        department.status = new_status
        department.save()


        serializer = self.get_serializer(department)
        return Response(serializer.data, status=status.HTTP_200_OK)
class DepartmentDetailView(generics.RetrieveUpdateAPIView):
    queryset = ManageDepartment.objects.all().order_by('-id')
    serializer_class = ManageDepartmentSerializer
    permission_classes = [AllowAny]


class DepartmentDeleteView(generics.RetrieveDestroyAPIView):
    queryset = ManageDepartment.objects.all()
    serializer_class = ManageDepartmentSerializer
    permission_classes = [AllowAny]

class ManageBlogCategoriesView(generics.ListCreateAPIView):
    queryset = ManageBlogCategories.objects.all()
    serializer_class = ManageBlogCategoriesSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        blogcategory_name = request.data.get('name')
        if ManageBlogCategories.objects.filter(name=blogcategory_name).exists():
            return Response(
                {"error": "Blog Category already exists", "status_code": 409},
                status=status.HTTP_200_OK
            )
        return super().create(request, *args, **kwargs)


    def patch(self, request, *args, **kwargs):
        blogcategory_id = self.kwargs.get('id')
        try:
            blogcategory = ManageBlogCategories.objects.get(id=blogcategory_id)
        except ManageBlogCategories.DoesNotExist:
            return Response({"error": "Blog Category not found"}, status=status.HTTP_404_NOT_FOUND)


        current_status = blogcategory.status
        new_status = 0 if current_status == 1 else 1
        blogcategory.status = new_status
        blogcategory.save()


        serializer = self.get_serializer(blogcategory)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogCategoryDetailView(generics.RetrieveUpdateAPIView):
    queryset = ManageBlogCategories.objects.all().order_by('-id')
    serializer_class = ManageBlogCategoriesSerializer
    permission_classes = [AllowAny]

class BlogCategoryDeleteView(generics.RetrieveDestroyAPIView):
    queryset = ManageBlogCategories.objects.all()
    serializer_class = ManageBlogCategoriesSerializer
    permission_classes = [AllowAny]

############## new manage slot #############
class DefaultSlotListCreateView(generics.ListCreateAPIView):
    queryset = DefaultSlot.objects.all()
    serializer_class = DefaultSlotSerializer
    permission_classes = [AllowAny]


    def list(self, request, *args, **kwargs):
        week_slots = {
            "sunday": [],
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": []
        }

        doctor_username = request.GET.get('username')
        slots = DefaultSlot.objects.filter(is_active=True,doctor__username=doctor_username).order_by('day_of_week', 'slot_number')

        
        for slot in slots:
            day = slot.day_of_week.lower()  
            if day in week_slots:  
                week_slots[day].append({
                    "id": slot.id,
                    "slot_number": slot.slot_number,
                    "start": slot.start_time,
                    "end": slot.end_time,
                    "duration": slot.duration
                })
        return Response(week_slots)

    def create(self, request, *args, **kwargs):
        doctor_username = request.data.get('username')  
        print(doctor_username,"doctor_username from create")
        doctor = Staff.objects.get(username=doctor_username) 
        data = request.data.copy()
        data['doctor'] = doctor.id  
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DefaultSlotRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DefaultSlot.objects.all()
    serializer_class = DefaultSlotSerializer

    permission_classes = [AllowAny]

class DefaultDayView(generics.ListAPIView):
    serializer_class = DefaultSlotSerializer

    permission_classes = [AllowAny]

    def get_queryset(self, request, username):
        day_of_week = self.kwargs.get('day_of_week')
        doctor_username = username  
        doctor = Staff.objects.get(username=doctor_username)
        return DefaultSlot.objects.filter(day_of_week=day_of_week, doctor=doctor, is_active=True)

    def list(self, request, *args, **kwargs):
        
        username = request.GET.get("username")
        queryset = self.get_queryset(request,username)
        if not queryset.exists():
            raise NotFound("No slots found for the specified day of the week.")

        return Response(self.get_serializer(queryset, many=True).data)

    def put(self, request, *args, **kwargs):
        day_of_week = self.kwargs.get('day_of_week')
        slots_data = request.data  
    
        if not isinstance(slots_data, list):
            return Response({"error": "Invalid data format. Expected a list."}, status=status.HTTP_400_BAD_REQUEST)
    
        updated_slots = []
        errors = []
    
        try:
            with transaction.atomic():
                for slot_data in slots_data:
                    slot_id = slot_data.get('id')
                    if not slot_id:
                        errors.append("Slot ID is required.")
                        continue
    
                    try:
                        slot_instance = DefaultSlot.objects.get(id=slot_id, day_of_week=day_of_week)

                        start_time = slot_data.get('start_time')
                        end_time = slot_data.get('end_time')
                        if start_time is None or end_time is None:
                            errors.append(f"Slot with id {slot_id} is missing start_time or end_time.")
                            continue

                        slot_instance.start_time = start_time
                        slot_instance.end_time = end_time
                        slot_instance.duration = slot_data.get('duration', slot_instance.duration)
                        slot_instance.save()
    
                        updated_slots.append(self.get_serializer(slot_instance).data)
    
                    except DefaultSlot.DoesNotExist:
                        errors.append(f"Slot with id {slot_id} not found.")
    
            if errors:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
    
            return Response(updated_slots, status=status.HTTP_200_OK)
    
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        day_of_week = self.kwargs.get('day_of_week')
        slot_ids = request.data.get('ids')  

        if not isinstance(slot_ids, list):
            return Response({"error": "Invalid data format. Expected a list of IDs."}, status=status.HTTP_400_BAD_REQUEST)

        deleted_slots = []
        errors = []

        try:
            with transaction.atomic():
                for slot_id in slot_ids:
                    if not isinstance(slot_id, int):  
                        errors.append(f"Invalid ID format: {slot_id}. Must be an integer.")
                        continue

                    try:
                        slot_instance = DefaultSlot.objects.get(id=slot_id, day_of_week=day_of_week)
                        slot_instance.delete()
                        deleted_slots.append(slot_id)

                    except DefaultSlot.DoesNotExist:
                        errors.append(f"Slot with id {slot_id} not found.")

            if errors:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"deleted_ids": deleted_slots}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SlotGenerationSettingViewSet(generics.ListCreateAPIView):
    queryset = SlotGenerationSetting.objects.all()
    serializer_class = SlotGenerationSettingSerializer
    permission_classes = [permissions.IsAuthenticated]
     
    def get_queryset(self,request):   
        doctor_username = request.GET.get('username')  
        doctor = Staff.objects.get(username=doctor_username)
        return SlotGenerationSetting.objects.filter(doctor=doctor)
    
    def get(self, request, *args, **kwargs):
        queryset=self.get_queryset(request)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        doctor_username = request.data.get('username')  
        doctor = Staff.objects.get(username=doctor_username)


        defaults = request.data.copy()
        defaults.pop('username', None)

        slot_generation_setting, created = SlotGenerationSetting.objects.get_or_create(
            doctor=doctor,
            defaults=defaults
        )

        if not created:
           
            for attr, value in request.data.items():
                setattr(slot_generation_setting, attr, value)
            slot_generation_setting.save()
        
        serializer = self.get_serializer(slot_generation_setting)
        return Response(serializer.data, status=201 if created else 200)
        
class SlotGenerationSettingPutViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = SlotGenerationSetting.objects.all()
    serializer_class = SlotGenerationSettingSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [AllowAny]


class DateSlotListView(GenericAPIView):
    serializer_class = DateSlotSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [AllowAny]

    def get_queryset(self, date,request,username):
        
        doctor_username = username  
        doctor = Staff.objects.get(username=doctor_username)
        return DateSlotModel.objects.filter(date=date,doctor=doctor,  is_active=True).order_by('slot_number')

    def get(self, request, date,  *args, **kwargs):
        username= request.GET.get('username')
        queryset=self.get_queryset(date,request,username)
        
        date_slots = queryset
        
        total_count = SubSlotModel.objects.filter(date_slot__date=date, is_active=True).count() 
        total_booked = SubSlotModel.objects.filter(date_slot__date=date,is_active=True, is_booked=True).count()  

        
        serializer = self.get_serializer(date_slots, many=True)

        
        response_data = {
            date: {
                "total_count": total_count,
                "total_booked": total_booked,
                "slots": serializer.data
            }
        }

        return Response(response_data)

    def post(self, request, date,  *args, **kwargs):

        
        # doctor_username = request.user.username
        doctor_username=request.data.get('username')
        print(doctor_username,"doctor_usernameeeeeee")
        start_time = parse_time(request.data.get('start_time'))
        end_time = parse_time(request.data.get('end_time'))
        
        try:
            duration = int(request.data.get('duration'))
        except (ValueError, TypeError):
            return Response({"error": "Invalid input for duration, must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        if not start_time or not end_time or duration <= 0:
            return Response({"error": "Invalid input, missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        doctordata = Staff.objects.get(username=doctor_username)

        new_slot = DateSlotModel.objects.create(doctor=doctordata, date=date, start_time=start_time, end_time=end_time, duration=duration)
        self.generate_sub_slots(new_slot)

        serializer = self.get_serializer(new_slot)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def generate_sub_slots(self, date_slot):
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

class AllSlotsView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        
        date_slots = DateSlotModel.objects.all()
        
        
        response_data = {}
        for date_slot in date_slots:
            date_str = date_slot.date.isoformat()  
            if date_str not in response_data:
                response_data[date_str] = {
                    "total_count": 0,
                    "total_booked": 0,
                    "slots": []
                }
           
            slot_data = {
                "id": date_slot.id,
                "slot_number": date_slot.slot_number,
                "start_time": date_slot.start_time,
                "end_time": date_slot.end_time,
                "duration": date_slot.duration,
                "is_active": date_slot.is_active,
                "sub_slots": []  
            }
                        
            sub_slots = SubSlotModel.objects.filter(date_slot=date_slot, is_active=True)
            for sub_slot in sub_slots:
                slot_data["sub_slots"].append({
                    "id": sub_slot.id,
                    
                    "start_time": sub_slot.start_time,
                    "end_time": sub_slot.end_time,
                    "is_active": sub_slot.is_active,
                    "is_booked": sub_slot.is_booked
                })
                if sub_slot.is_active:
                    response_data[date_str]["total_count"] += 1
                if sub_slot.is_booked:
                    response_data[date_str]["total_booked"] += 1
            
            
            response_data[date_str]["slots"].append(slot_data)

        return Response(response_data, status=status.HTTP_200_OK)

class DoctorMonthlySlotsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, year, month,username, *args, **kwargs):
        try:
            year = int(year)
            month = int(month)
            username = username
        except ValueError:
            return Response({"error": "Invalid year or month"}, status=status.HTTP_400_BAD_REQUEST)
        doctor = Staff.objects.get(username=username)
        print(doctor.id, "doctor")
        date_slots = DateSlotModel.objects.filter(date__year=year, date__month=month, doctor=doctor.id)
        

        response_data = {}
        for date_slot in date_slots:
            date_str = date_slot.date.isoformat()  
            if date_str not in response_data:
                response_data[date_str] = {
                    "total_count": 0,
                    "total_booked": 0,
                    "slots": []
                }

            slot_data = {
                "id": date_slot.id,
                "slot_number": date_slot.slot_number,
                "start_time": date_slot.start_time,
                "end_time": date_slot.end_time,
                "duration": date_slot.duration,
                "is_active": date_slot.is_active,
                "sub_slot_count": 0,  
                "booked_sub_slot_count": 0,  
                "sub_slots": []  
            }
            
            sub_slots = SubSlotModel.objects.filter(date_slot=date_slot)
            
            for sub_slot in sub_slots:
                slot_data["sub_slots"].append({
                    "id": sub_slot.id,
                    "start_time": sub_slot.start_time,
                    "end_time": sub_slot.end_time,
                    "is_active": sub_slot.is_active,
                    "is_booked": sub_slot.is_booked
                })

                slot_data["sub_slot_count"] += 1  
                if sub_slot.is_booked:
                    slot_data["booked_sub_slot_count"] += 1
                if sub_slot.is_active:
                    response_data[date_str]["total_count"] += 1
                if sub_slot.is_booked:
                    response_data[date_str]["total_booked"] += 1
            
            response_data[date_str]["slots"].append(slot_data)

        return Response(response_data, status=status.HTTP_200_OK)
        
class MonthlySlotsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, year, month, *args, **kwargs):
        try:
            year = int(year)
            month = int(month)
            username = request.GET.get('username') 
            # user = request.user.username
            
        except ValueError:
            return Response({"error": "Invalid year or month"}, status=status.HTTP_400_BAD_REQUEST)
        doctor = Staff.objects.get(username=username)
        
        date_slots = DateSlotModel.objects.filter(date__year=year,doctor=doctor.id,date__month=month)
        

        response_data = {}
        for date_slot in date_slots:
            date_str = date_slot.date.isoformat()  
            if date_str not in response_data:
                response_data[date_str] = {
                    "total_count": 0,
                    "total_booked": 0,
                    "slots": []
                }

            slot_data = {
                "id": date_slot.id,
                "slot_number": date_slot.slot_number,
                "start_time": date_slot.start_time,
                "end_time": date_slot.end_time,
                "duration": date_slot.duration,
                "is_active": date_slot.is_active,
                "sub_slot_count": 0,  
                "booked_sub_slot_count": 0,  
                "sub_slots": []  
            }
            
            sub_slots = SubSlotModel.objects.filter(date_slot=date_slot)
            
            for sub_slot in sub_slots:
                slot_data["sub_slots"].append({
                    "id": sub_slot.id,
                    "start_time": sub_slot.start_time,
                    "end_time": sub_slot.end_time,
                    "is_active": sub_slot.is_active,
                    "is_booked": sub_slot.is_booked
                })

                slot_data["sub_slot_count"] += 1  
                if sub_slot.is_booked:
                    slot_data["booked_sub_slot_count"] += 1
                if sub_slot.is_active:
                    response_data[date_str]["total_count"] += 1
                if sub_slot.is_booked:
                    response_data[date_str]["total_booked"] += 1
            
            response_data[date_str]["slots"].append(slot_data)

        return Response(response_data, status=status.HTTP_200_OK)

class DateSlotManipulationAPIView(GenericAPIView):
    serializer_class = DateSlotSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [AllowAny]

    # def put(self, request, pk, *args, **kwargs):
    #     """Handle updating a slot and its sub-slots."""
    #     try:
    #         date_slot = DateSlotModel.objects.get(id=pk)
    #     except DateSlotModel.DoesNotExist:
    #         return Response({"error": "Slot not found"}, status=status.HTTP_404_NOT_FOUND)

        
    #     date_slot.start_time = request.data.get('start_time', date_slot.start_time)
    #     date_slot.end_time = request.data.get('end_time', date_slot.end_time)
    #     date_slot.duration = request.data.get('duration', date_slot.duration)
    #     # date_slot.is_active = request.data.get('is_active', date_slot.is_active)

    #     date_slot.save()

        
    #     date_slot.generate_sub_slots()

    #     # Return the updated data
    #     serializer = self.get_serializer(date_slot)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    def convert_time_string_to_time(self,time_str):
        return datetime.strptime(time_str, "%H:%M:%S").time()
    def put(self, request, pk, *args, **kwargs):
        """Handle updating a slot and its sub-slots."""
        try:
            date_slot = DateSlotModel.objects.get(id=pk)
        except DateSlotModel.DoesNotExist:
            return Response({"error": "Slot not found"}, status=status.HTTP_404_NOT_FOUND)

        # start_time_str = request.data.get('start_time')
        # end_time_str = request.data.get('end_time')

        # print(start_time_str)
        # print(end_time_str)

        # if start_time_str and end_time_str:
        #     date_slot.start_time = self.convert_time_string_to_time(start_time_str)
        #     date_slot.end_time = self.convert_time_string_to_time(end_time_str)

        old_start_time = date_slot.start_time
        old_end_time = date_slot.end_time

        date_slot.start_time = request.data.get('start_time',date_slot.start_time)
        date_slot.end_time = request.data.get('end_time',date_slot.end_time)
        date_slot.duration = request.data.get('duration', date_slot.duration)
        
        date_slot.save()
       
        date_slot.sub_slots.filter(start_time__gte=old_start_time, end_time__lte=old_end_time).delete()

        date_slot.generate_sub_slots()
    
        serializer = self.get_serializer(date_slot)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, *args, **kwargs):
        """Handle deleting a slot and cascading the delete to sub-slots."""
        try:
            date_slot = DateSlotModel.objects.get(id=pk)
        except DateSlotModel.DoesNotExist:
            return Response({"error": "Slot not found"}, status=status.HTTP_404_NOT_FOUND)

        date_slot.delete()
        return Response({"message": "Slot and associated sub-slots deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk, *args, **kwargs):
        """Handle only updating the is_active field."""
        try:
            
            date_slot = DateSlotModel.objects.get(id=pk)
        except DateSlotModel.DoesNotExist:
            return Response({"error": "Slot not found"}, status=status.HTTP_404_NOT_FOUND)

        is_active = request.data.get('is_active')
        print(is_active)
        if is_active is not None:
            is_active = bool(is_active)
            date_slot.is_active = is_active
            date_slot.save()

            serializer = self.get_serializer(date_slot)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "is_active field is required."}, status=status.HTTP_400_BAD_REQUEST)
class DateSubSlotManipulationAPIView(GenericAPIView):
    serializer_class = SubSlotSerializer

    def delete(self, request, pk, *args, **kwargs):
        """Handle deleting a sub-slot."""
        try:
            sub_slot = SubSlotModel.objects.get(id=pk)
        except SubSlotModel.DoesNotExist:
            return Response({"error": "Sub-slot not found"}, status=status.HTTP_404_NOT_FOUND)

        sub_slot.delete()

        return Response({"message": "Sub-slot deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    def patch(self,request,pk, *args, **kwargs):
        try:
            sub_slot = SubSlotModel.objects.get(id=pk)
        except SubSlotModel.DoesNotExist:
            return Response({"error": "Sub-slot not found"}, status=status.HTTP_404_NOT_FOUND)

        is_active = request.data.get('is_active')
        if is_active is not None:
            is_active = bool(is_active)
            sub_slot.is_active = is_active
            sub_slot.save()

            serializer = self.get_serializer(sub_slot)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "is_active field is required."}, status=status.HTTP_400_BAD_REQUEST)
        
class HolidayListCreateView(generics.ListCreateAPIView):
    queryset=HolidayModel.objects.all()
    serializer_class = HolidayModelSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        username = request.GET.get('username')
        # user = request.user.username
        print(username,"usernameee")
        doctor = Staff.objects.get(username=username)
        queryset = queryset.filter(doctor=doctor)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        dates = request.data.get('dates')  
        comments = request.data.get('comments')
        username = request.data.get('username')

        if not dates:
            return Response({"error": "No dates provided"}, status=status.HTTP_400_BAD_REQUEST)
    
        user = request.user.username
        print(username,"user")
        doctor = Staff.objects.get(username=username)
        
        saved_data = [] 
    
        for date in dates:
            serializer = self.get_serializer(data={'date': date, 'doctor': doctor.id, 'comment': comments}) 
            print(serializer, "dates")
            serializer.is_valid(raise_exception=True)
            serializer.save()
            saved_data.append(serializer.data)
    
        return Response(saved_data, status=status.HTTP_201_CREATED)

    
    def delete(self, request, *args, **kwargs):
        dates = request.data.get('dates')
        username =request.data.get('username')  
        if not dates:
            return Response({"error": "No dates provided"}, status=status.HTTP_400_BAD_REQUEST)
    
        user = request.user.username
        print(username,"username")
        doctor = Staff.objects.get(username=username)
    
        deleted_data = []
    
        for date in dates:
            try:
                holiday = HolidayModel.objects.filter(date=date, doctor=doctor)
                holiday.delete()
                deleted_data.append(date)  
            except HolidayModel.DoesNotExist:
                return Response({"error": f"No holiday found for date: {date}"}, status=status.HTTP_404_NOT_FOUND)
    
        return Response(deleted_data, status=status.HTTP_204_NO_CONTENT)

class HolidayRetrieveView(generics.RetrieveAPIView):
    serializer_class = HolidayModelSerializer
    permission_classes = [permissions.AllowAny]  
    queryset = HolidayModel.objects.all()
    def get(self, request, username, *args, **kwargs):
        doctor = get_object_or_404(Staff, username=username)

        holidays = HolidayModel.objects.filter(doctor=doctor)

        serializer = self.get_serializer(holidays, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GraphsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):

        user = request.user  
        print(user)
        today = date.today()

        sub_slots_query = SubSlotModel.objects.filter(date_slot__date=today,is_active=True,)
        bookings_query = Booking.objects.filter(sub_slot__date_slot__date=today)
        cancelled_query = CancelledBooking.objects.filter(booking__sub_slot__date_slot__date=today)

        if (user.is_superuser and user.is_staff and not user.is_vendor) or (not (user.is_superuser or user.is_staff) and user.is_vendor) or (not user.is_superuser and user.is_staff and user.is_vendor):
            total_sub_slots = sub_slots_query.count()
            confirmed_appointments = bookings_query.filter(status=Booking.STATUS_BOOKED).count()
            cancelled_appointments = cancelled_query.count()


        elif user.is_staff and not user.is_superuser and not user.is_vendor:
            doctor_id=Staff.objects.get(username=user).id

            total_sub_slots = SubSlotModel.objects.filter(date_slot__date=today, date_slot__doctor=doctor_id,is_active=True,).count()
            confirmed_appointments = Booking.objects.filter(sub_slot__date_slot__date=today, username=user,status=Booking.STATUS_BOOKED).count()
            cancelled_appointments = Booking.objects.filter(sub_slot__date_slot__date=today, username=user,status=Booking.STATUS_CANCELLED).count()
        
        else:
            return Response({"detail": "Access denied."}, status=403)

        return Response({
            "date": today,
            "total_sub_slots": total_sub_slots,
            "confirmed_appointments": confirmed_appointments,
            "cancelled_appointments": cancelled_appointments,
        })
class WeeklyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())  
        end_of_week = start_of_week + timedelta(days=6) 
        user = request.user 

        weekly_data = {
            "dates": [],
            "booked": [],
            "available": [],
            "cancelled": [],
        }

        for i in range(7):
            day = start_of_week + timedelta(days=i)
            print(day,"dayyyyyyyyyyy")
            weekly_data["dates"].append(day.strftime("%d/%m"))

            if (user.is_superuser and user.is_staff and not user.is_vendor) or (not (user.is_superuser or user.is_staff) and user.is_vendor) or (not user.is_superuser and user.is_staff and user.is_vendor):
                booked_count = Booking.objects.filter(
                    sub_slot__date_slot__date=day,
                    status=Booking.STATUS_BOOKED,
                    
                ).count()


                total_available_count = SubSlotModel.objects.filter(
                    date_slot__date=day,
                    is_active=True
                ).count()
                available_count = total_available_count - booked_count

                cancelled_count = CancelledBooking.objects.filter(
                    booking__sub_slot__date_slot__date=day
                ).count()

            elif user.is_staff and not user.is_superuser and not user.is_vendor:
                doctor_id=Staff.objects.get(username=user).id
                booked_count = Booking.objects.filter(
                    sub_slot__date_slot__date=day,
                    status=Booking.STATUS_BOOKED,
                    username=user 
                ).count()

                total_available_count = SubSlotModel.objects.filter(
                    is_active=True,
                    date_slot__date=today, date_slot__doctor=doctor_id 
                ).count()

                cancelled_count = Booking.objects.filter(
                    sub_slot__date_slot__date=day,
                    status=Booking.STATUS_CANCELLED,
                    username=user 
                ).count()

            else:
               
                booked_count = 0
                total_available_count = 0
                cancelled_count = 0

            available_count = total_available_count - booked_count
            weekly_data["booked"].append(booked_count)
            weekly_data["available"].append(max(available_count, 0))  
            weekly_data["cancelled"].append(cancelled_count)

        return Response(weekly_data)
class GenerateSlotsView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        try:
            generate_slots_for_doctor()  
            return JsonResponse({'status': 'success', 'message': 'Slots generated successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})


class CancelBookingView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, pk):
        booking = Booking.objects.all().get(id=pk)
        email = SetupNotificationsDetails.objects.first().email
        try:     
            print(request.user)         
            booking.cancel_booking(user=request.user)
            
            self.send_appointment_cancellation_email(booking,email)
            self.send_appointment_cancellation_sms(booking)
            return Response({"message": "Booking cancelled successfully."}, status=status.HTTP_200_OK)
        except PermissionError as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

    def send_appointment_cancellation_email(self,booking,email):
        
        subject = 'Appointment Cancelled'
        html_message = render_to_string('drconsult/appointment_cancellation_email.html', {
            'name':booking.name,
            'doctor_name': booking.doctor,
            'date': booking.date,
            'time': booking.time 
        })

        plain_message = strip_tags(html_message)

        
        patient_email = booking.email
       
            
        
        from_email = email
        recipient_list = [patient_email]

        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
        )
        
        email.attach_alternative(html_message, "text/html")
        
        
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
        
        email.send(fail_silently=False)

    def send_appointment_cancellation_sms(self, booking):
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        from_no = settings.TWILIO_PHONE_NUMBER


        message_body = f"Dear {booking.name},\n\nWe regret to inform you that your appointment with Dr. {booking.doctor} on {booking.date} at {booking.time} has been cancelled.\n\nWe apologize for the inconvenience. Please contact us if you would like to reschedule or need further assistance.\n\nThank you for understanding.\n\nBest regards,\nDr.Consultation;"


        try:
            message = client.messages.create(
                body=message_body,
                from_='whatsapp:+14155238886',
                to=f'whatsapp:+91{booking.contact}'
            )
            
            return message.sid 
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]  
    

    def get(self, request, username, *args, **kwargs):
        notifications = Notification.objects.filter(doctor=username).order_by('-id')
        unread_count = notifications.filter(is_read=False).count()
        serializer = self.get_serializer(notifications, many=True)
    
        response_data = {
            "notifications": serializer.data,
            "unread_count": unread_count
        }
        return Response(response_data, status=status.HTTP_200_OK)

class MarkNotificationAsReadView(generics.RetrieveUpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny] 
    lookup_url_kwarg = 'notification_id'
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data={'is_read': True}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Notification marked as read"})

###### Patients ######

class RegisterPatientView(generics.CreateAPIView):
    serializer_class = RegisterPatientSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        temp_password = password
        user = CustomUser.objects.create_user(username=username, password=password, email=email, is_active=False,is_vendor=False, is_staff=False, is_superuser=False)
        email = Configuration.objects.first().email_address
        self.send_patient_registration_email(user,temp_password,email)

        return Response({"message": "Patient registered successfully."}, status=status.HTTP_201_CREATED)

    def send_patient_registration_email(self, user,temp_password,email):
        subject = 'Welcome to Doctor Consultation – Your Account Details'
        html_message = render_to_string('drconsult/user_registration_email.html', {
            'username': user.username,
            'password': temp_password,
            'activation_link': f'http://192.168.1.25:3000/authenticate/user/{user.username}'  
        })

        plain_message = strip_tags(html_message)

        try:
            user_email = user.email
        except user.DoesNotExist:
            return
        
        from_email = email
        recipient_list = [user_email]

        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
        )
        
        email.attach_alternative(html_message, "text/html")
        
        
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
        
        email.send(fail_silently=False)


class CheckUsernameView(generics.GenericAPIView):

    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    def get(self, request):
        username = request.query_params.get('username', None)
        if username:
            exists = CustomUser.objects.filter(username=username).exists()
            return Response({'exists': exists}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_400_BAD_REQUEST)

class PatientLoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']        
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            
            Token.objects.filter(user=user).delete()
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'username': user.username,
                'status': 'success',
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_vendor':user.is_vendor,
                'http_status_code': status.HTTP_200_OK
            }
            
            response = Response(response_data, status=status.HTTP_200_OK)
    
            expires_at = timezone.now() + timedelta(hours=1)
            return response
        return Response({'error': 'Invalid credentials or user is not a patient'}, status=status.HTTP_400_BAD_REQUEST)

class AccountConfirmationView(generics.GenericAPIView):
    serializer_class = RegisterPatientSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "username"
    def put(self, request, *args, **kwargs):

        username = request.data.get('username')
        try:
            user = CustomUser.objects.get(username=username)
            user.is_active = True
            user.save()
            response_data = {
                'status': 'success',
                'http_status_code': status.HTTP_200_OK,
                'is_staff': user.is_staff,
                'is_vendor': getattr(user, 'is_vendor', False),  
                'is_superuser': user.is_superuser,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:

            return Response({'error': 'Username does not exist'}, status=status.HTTP_404_NOT_FOUND)

class SinglePatientProfileView(generics.RetrieveUpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "username"

    def get_object(self):

        username = self.kwargs.get("username")
        patient = get_object_or_404(Patient, username__username=username)
        return patient
    
    
    def get(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        
        try:
            patient = Patient.objects.get(username__username=username)
            serializer = self.get_serializer(patient)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)  
        instance = self.get_object()
        mutable_data = request.data.copy()
        if "image" not in request.FILES and "image" in mutable_data:
            mutable_data.pop("image", None)
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PatientBookingHistoryView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]  

    lookup_field = "username"

    def get_queryset(self):

        if self.request.user.is_authenticated:
            patient = self.request.user
            patient_id= Patient.objects.get(username_id=patient.id)
            return Booking.objects.filter(patient=patient_id, is_patient=True).order_by('-date')
            
        return Booking.objects.none()

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        upcoming_bookings = queryset.filter(
        Q(date__gt=date.today()) | 
        Q(date=date.today(), time__gte=datetime.now().time()), 
        status='confirmed'
    )
        completed_bookings = queryset.filter(
        Q(date__lt=date.today()) | 
        Q(date=date.today(), time__lt=datetime.now().time()), 
        status='confirmed'
    )
        cancelled_bookings = queryset.filter(status='cancelled')

        upcoming_serializer = self.get_serializer(upcoming_bookings, many=True)
        completed_serializer = self.get_serializer(completed_bookings, many=True)
        cancelled_serializer = self.get_serializer(cancelled_bookings, many=True)

        response_data = {
            "status": "success",
            "data": {
                "patient_id": request.user.id,
                "total_appointments": queryset.count(),
                "appointments": {
                    "upcoming": upcoming_serializer.data,
                    "completed": completed_serializer.data,
                    "cancelled": cancelled_serializer.data,
                }
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)

class PatientDocumentCreateView(generics.CreateAPIView):
    serializer_class = PatientDocumentSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        patient = self.request.user
        patient_id= Patient.objects.get(username_id=patient.id)
        serializer.save(patient=patient_id)


class PatientDocumentListView(generics.ListAPIView):
    serializer_class = PatientDocumentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        patient = self.request.user
        patient_id= Patient.objects.get(username_id=patient.id)
        return PatientDocument.objects.filter(patient=patient_id)


class PatientDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientDocumentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        patient = self.request.user
        patient_id= Patient.objects.get(username_id=patient.id)
        return PatientDocument.objects.filter(patient=patient_id)

    def delete(self, request, *args, **kwargs):
        patient = self.request.user
        patient_id= Patient.objects.get(username_id=patient.id)
        document = PatientDocument.objects.get( pk=kwargs['pk'], patient=patient_id)
        document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserDashboardDetailView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]
    lookup_field = "username"

    def get(self, request, *args, **kwargs):
            username = self.kwargs.get('username')

            try:

                patient = Patient.objects.get(username__username=username)

                upcoming_bookings = Booking.objects.filter(
                    patient=patient,
                    is_patient=True,
                    status='confirmed'
                ).filter(
                    Q(date__gt=date.today()) | 
                    Q(date=date.today(), time__gte=datetime.now().time())
                ).order_by('-date')

         
                documents = PatientDocument.objects.filter(patient=patient)


                patient_serializer = self.get_serializer(patient)
                bookings_serializer = BookingSerializer(upcoming_bookings, many=True) 
                documents_serializer = PatientDocumentSerializer(documents, many=True, context={'request': request}) 


                response_data = {
                    "status": "success",
                    "data": {
                        "patient": patient_serializer.data,
                        "upcoming_bookings": bookings_serializer.data,
                        "documents": documents_serializer.data
                    }
                }
                return Response(response_data, status=status.HTTP_200_OK)

            except Patient.DoesNotExist:
                return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)




    

###Vendor###

class RegisterVendorView(generics.CreateAPIView):
    serializer_class = RegisterVendorSerializer
    queryset = CustomUser.objects.all()

    def perform_create(self, serializer):

        raw_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))  
        vendor = serializer.save(password=raw_password)
        setup_notification = SetupNotificationsDetails.objects.first()
        if setup_notification:
            email = setup_notification.email
        else:
            email = 'bhavya.lohami@logicspice.com'
        
        try:
            vendor = CustomUser.objects.get(username=vendor.username)
            vendor_name = vendor.first_name + vendor.last_name  
        except vendor.DoesNotExist:
            doctor_name = 'Vendor'
        self.send_vendor_registration_email(vendor, vendor_name, raw_password,email)

    # def post(self, request, *args, **kwargs):
    #     username = request.data.get('username')
    #     # password = request.data.get('password')
    #     email = request.data.get('email')
    #     first_name = request.data.get('first_name')
    #     last_name = request.data.get('last_name')
    #     is_staff = request.data.get('is_staff')
    #     temp_password = request.data.get('password')
    #     print(temp_password)
    #     user = CustomUser.objects.create_user(first_name=first_name,last_name=last_name,username=username,password=temp_password, email=email, is_active=False, is_staff=is_staff, is_superuser=False,is_vendor=True)

    #     self.send_vendor_registration_email(user,temp_password)

    #     return Response({"message": "Vendor registered successfully."}, status=status.HTTP_201_CREATED)

    def send_vendor_registration_email(self, vendor,vendor_name,raw_password,email):
        subject = 'Welcome to Doctor Consultation – Your Account Details'
        html_message = render_to_string('drconsult/vendor_registration_email.html', {
            'first_name': vendor_name,
            'username': vendor.username,
            'password': raw_password,
            'activation_link': f'http://192.168.1.25:3000/authenticate/user/{vendor.username}'  
        })

        plain_message = strip_tags(html_message)

        try:
            user_email = vendor.email
        except user.DoesNotExist:
            return
        
        from_email = email
        recipient_list = [user_email]

        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email,
            to=recipient_list
        )
        
        email.attach_alternative(html_message, "text/html")
        
        
        logo_path = finders.find("drconsult/logo.png")
        if logo_path:
            with open(logo_path, 'rb') as img:
                logo = MIMEImage(img.read())
                logo.add_header('Content-ID', '<logo>')
                email.attach(logo)
        
        email.send(fail_silently=False)

class VendorLoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']        
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            
            Token.objects.filter(user=user).delete()
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'username': user.username,
                'status': 'success',
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_vendor': user.is_vendor,
                'http_status_code': status.HTTP_200_OK,
                'roles': user.roles,
                'subroles':user.subroles,
            }
            
            response = Response(response_data, status=status.HTTP_200_OK)
    
            expires_at = timezone.now() + timedelta(hours=1)
            return response
        return Response({'error': 'Invalid credentials or user is not a patient'}, status=status.HTTP_400_BAD_REQUEST)

class VendorProfileView(generics.RetrieveUpdateAPIView):
   parser_classes = [MultiPartParser, FormParser]
   queryset = VendorUser.objects.all()
   serializer_class = VendorUserSerializer
   permission_classes = [AllowAny]
   lookup_field = 'username'

   def get(self, request, *args, **kwargs):
       username = kwargs['username']
       id=CustomUser.objects.get(username=username).id
       response = VendorUser.objects.get(username_id=id)
       serializer = VendorUserSerializer(response)
       print(serializer.data.get('image'))
       
       return Response(serializer.data, status=status.HTTP_200_OK) 
       
class VendorInformationView(generics.RetrieveUpdateAPIView):
    queryset = VendorUser.objects.all()
    serializer_class = VendorUserSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        mutable_data = request.data.copy()

        if "image" not in request.FILES and "image" in mutable_data:

            mutable_data.pop("image", None)

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


    def get(self, request, *args, **kwargs):
        vendor_id=VendorUser.objects.first().username_id
        print(vendor_id)
        user = CustomUser.objects.get(id=vendor_id)
        Status = user.is_active
        Uname=user.username
        vendor = VendorUser.objects.get(username_id=vendor_id)
        serializer = self.get_serializer(vendor)
        response_data = {
            
                "vendor": serializer.data,
                "status": Status,
                "Uname" : Uname,
        }
        return Response(response_data, status=status.HTTP_200_OK)
 
class VendorProfile(generics.RetrieveUpdateAPIView):
    queryset = VendorUser.objects.all()
    serializer_class = VendorUserSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        vendor_user = VendorUser.objects.first()
        if not vendor_user:
            return Response({"error": "No VendorUser found."}, status=status.HTTP_200_OK)

        vendor_id = vendor_user.username_id
        print(vendor_id)

        try:
            user = CustomUser.objects.get(id=vendor_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Associated CustomUser not found."}, status=status.HTTP_404_NOT_FOUND)

        status_flag = user.is_active
        uname = user.username
        vendor = VendorUser.objects.get(username_id=vendor_id)
        serializer = self.get_serializer(vendor)
    
        response_data = {
            "vendor": serializer.data,
            "status": status_flag,
            "Uname": uname,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class ChangeStatusView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ChangeStatusSerializer
    permission_classes = [AllowAny]
    
    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        vendor_id= VendorUser.objects.first().username_id

        try:
            user = CustomUser.objects.get(id=vendor_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Toggle the status
        current_status = user.is_active
        new_status = 0 if current_status == 1 else 1
        user.is_active = new_status
        user.save()

        Doctors = CustomUser.objects.filter(is_staff=True , is_superuser=False)
        for doctor in Doctors:
            doctor.is_active = new_status
            doctor.save()

        # Return the updated user object
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FeedbackView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FeedbackPostSerializer
        return FeedbackGetSerializer

    def create(self, request, *args, **kwargs):
        
        patient = request.user.id 
        patient_id = Patient.objects.get(username_id=patient).id
        doctor = request.data.get('doctor')
        doctor_id = Staff.objects.get(id=doctor).fname+" "+Staff.objects.get(id=doctor).lname
        review = request.data.get('review')
        rating = request.data.get('rating')
        

        if not doctor :
            return Response(
                {"error": "Doctor fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        check_doctor_count = Booking.objects.filter(
            patient=patient_id,
            doctor=doctor_id,
            status=Booking.STATUS_BOOKED,  
            date__lte=now().date()  
            ).count()

        has_valid_booking = check_doctor_count > 0


        if not has_valid_booking:
            return Response(
                {"error": "You cannot leave a review for this doctor as you do not have a completed booking."},
                status=status.HTTP_400_BAD_REQUEST
            )
        feedback_data = {
            "patient": patient_id,
            "doctor": doctor,
            "review": review,
            "rating": rating,
        }

        serializer = self.get_serializer(data=feedback_data)
       
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DetailFeedbackView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FeedbackPostSerializer
        return FeedbackGetSerializer


    def get(self, request, *args, **kwargs):
        doctor_id = kwargs.get('pk')

        try:
            doctor = Staff.objects.get(id=doctor_id)
            doctor_serializer = StaffSerializer(doctor, context={'request': request})   
        except Staff.DoesNotExist:
            return Response(
                {"detail": "Doctor not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        feedback_queryset = Feedback.objects.filter(doctor_id=doctor_id).order_by('-created_at')

        if not feedback_queryset.exists():
            response_data = {
                "doctor": doctor_serializer.data,  
                "overall_rating": 0,
                "feedback": []
            }
            return Response(response_data, status=status.HTTP_200_OK)

        overall_rating = feedback_queryset.aggregate(Avg('rating'))['rating__avg'] or 0

        feedback_serializer = FeedbackGetSerializer(feedback_queryset, many=True)


        response_data = {
            "doctor": doctor_serializer.data,
            "overall_rating": overall_rating,
            "feedback": feedback_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

class ManageFeedbackView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = FeedbackSerializer

    def get(self, request, *args, **kwargs):
        try:
            feedback = Feedback.objects.all()
        except Feedback.DoesNotExist:
            return Response(
                {"detail": "Feedback not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        feedback_serializer = FeedbackSerializer(feedback, many=True)               

        return Response(feedback_serializer.data, status=status.HTTP_200_OK)

class ManageFeedbackStatus(generics.RetrieveUpdateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        feedback_id = self.kwargs.get('id')

        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        feedback.is_active = not feedback.is_active
        feedback.save()

        serializer = self.get_serializer(feedback)
        return Response(serializer.data, status=status.HTTP_200_OK)



class RolesView(APIView):
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
    def get(self, request,*args,**kwargs):
        username = kwargs.get('username')

        user = CustomUser.objects.get(username=username)
        user_roles = user.roles or [] 

        ids = [item for item in user_roles]

        user_subroles = user.subroles or [] 
     
        sub_ids = [f"{item['roleId']}[{','.join(map(str, item['subroles']))}]" for item in user_subroles]


        data = {}
        for role_id, role_name in ROLES.items():
            role_data = {
                "roles": {
                    "id": role_id,
                    "name": role_name,
                    "marked": role_id in ids  
                },
                "subroles": []
            }

            if role_id in SUBROLES:
                subroles = SUBROLES[role_id]
                
                matching_subroles = [
                    int(sub_id) 
                    for sub_id_str in sub_ids 
                    if sub_id_str.startswith(f"{role_id}[")
                    for sub_id in sub_id_str.split("[")[1].rstrip("]").split(",")
                ]
                subrole_list = [
                    {
                        "id": sub_id,
                        "name": sub_name,
                        "marked": sub_id in matching_subroles  
                    }
                    for sub_id, sub_name in subroles.items()
                ]
                role_data["subroles"] = subrole_list

            data[role_id] = role_data
        

        return Response(data)   

class UpdateRolesView(APIView):
    permission_classes = [AllowAny]
    def patch(self, request):
        username = request.data.get('user','')
        user = CustomUser.objects.get(username=username)
        user.roles = request.data.get('roles',[])
        user.subroles = request.data.get('subroles',[])
        user.save()
        return Response({"message": "Roles updated successfully."}, status=status.HTTP_200_OK)

class ManageRolesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = {}
        for role_id, role_name in ROLES.items():
            role_data = {
                "roles": {role_id: role_name},  
                "subroles": [] 
            }
            if role_id in SUBROLES:
                subroles = SUBROLES[role_id]
                subrole_list = [{str(sub_id): sub_name} for sub_id, sub_name in subroles.items()]
                role_data["subroles"] = subrole_list
            
            data[role_id] = [role_data]
        
        return Response(data)

class GetDoctorsView(APIView):
    permission_classes = [AllowAny]
    serializer_class = StafffSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        try:
            doctors = Staff.objects.filter(status=True)
        except Staff.DoesNotExist:
            return Response(
                {"detail": "Staff not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        doctors_serializer = StafffSerializer(doctors, many=True)               

        return Response(doctors_serializer.data, status=status.HTTP_200_OK)

    class ProxyGeoNamesView(View):
        def get(self, request, *args, **kwargs):
            try:
                
                response = requests.get(
                    "http://api.geonames.org/countryInfoJSON",
                    params={"username": "shivamlogicspice"}
                )
                response.raise_for_status()  
                data = response.json()  
                return JsonResponse(data)  
            except requests.RequestException as e:
                
                return JsonResponse({"error": "Failed to fetch GeoNames data", "details": str(e)}, status=500)

    class ToggleUserStatusView(APIView):
        def patch(self, request):
            staff_id = request.data.get('staff_id')
            current_status = request.data.get('current_status')

            try:
                staff = Staff.objects.get(id=staff_id)
                username = staff.username
                user = User.objects.get(username=username)
                user.is_active = not current_status
                user.save()

                return Response(
                    {"message": "User status updated successfully", "is_active": user.is_active},
                    status=status.HTTP_200_OK,
                )
            except Staff.DoesNotExist:
                return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

##################################### Manage Patients ##############################################      
class PatientView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        Patient_data = []
        try:
            patients = Patient.objects.all()
            for patient in patients:
                user=patient.username_id
                users = CustomUser.objects.filter(is_superuser=False, is_staff=False, is_vendor=False)
                user=users.filter(id=patient.username_id).first()
                is_active = user.is_active if user else False
              

                serialized_patient = self.get_serializer(patient).data
                serialized_patient['is_active'] = is_active
                Patient_data.append(serialized_patient)

            return Response(Patient_data, status=status.HTTP_200_OK)

        except Patient.DoesNotExist:
            return Response(
                {"detail": "Patient not found."},
                status=status.HTTP_404_NOT_FOUND
            )
class PatientDeleteView(generics.DestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    def delete(self, request, *args, **kwargs):
       
        Patient = self.get_object()
        username_id = Patient.username_id 
        user = CustomUser.objects.get(id=username_id)
        user.delete()
        Patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PatientAccountView(generics.RetrieveUpdateAPIView):    
    permission_classes = [AllowAny]
    def patch (self, request, *args, **kwargs):
        patient_id = request.data.get('patient_id')
        current_status = request.data.get('status')
        try:
            patient_username = Patient.objects.get(id=patient_id).username
            user = CustomUser.objects.get(username=patient_username)
            user.is_active = current_status
            user.save()
            return Response(
                {"message": "Patient Account updated successfully"},
                status=status.HTTP_200_OK,
            )
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


class SinglePatientView(generics.RetrieveUpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]
    # lookup_field = "username"

    def get_object(self):
        id = self.kwargs.get("id")
        patient = get_object_or_404(Patient, id=id)
        return patient
    
    
    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        try:
            patient = Patient.objects.get(id=id)
            serializer = self.get_serializer(patient)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)  
        instance = self.get_object()
        mutable_data = request.data.copy()
        if "image" not in request.FILES and "image" in mutable_data:
            mutable_data.pop("image", None)
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProxyGeoNamesView(View):
    def get(self, request, *args, **kwargs):
        try:
            
            response = requests.get(
                "http://api.geonames.org/countryInfoJSON",
                params={"username": "shivamlogicspice"}
            )
            response.raise_for_status()  
            data = response.json()  
            return JsonResponse(data)  
        except requests.RequestException as e:
            
            return JsonResponse({"error": "Failed to fetch GeoNames data", "details": str(e)}, status=500)

class ToggleUserStatusView(APIView):
    def patch(self, request):
        staff_id = request.data.get('staff_id')
        current_status = request.data.get('current_status')

        try:
            staff = Staff.objects.get(id=staff_id)
            username = staff.username
            user = User.objects.get(username=username)
            user.is_active = not current_status
            user.save()

            return Response(
                {"message": "User status updated successfully", "is_active": user.is_active},
                status=status.HTTP_200_OK,
            )
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SetupNotificationsView(generics.RetrieveUpdateAPIView):
    queryset = SetupNotificationsDetails.objects.all()
    serializer_class = SetupNotificationsDetailsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        obj, created = SetupNotificationsDetails.objects.get_or_create(id=1)
        return obj
    
class StaffSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('q', '')
        if query:
            staff = Staff.objects.filter(
                Q(fname__icontains=query) |
                Q(lname__icontains=query) |
                Q(role__icontains=query) |
                Q(location__icontains=query) |
                Q(department__icontains=query)
            )
        else:
            staff = Staff.objects.none()
        serializer = StaffSerializer(staff, many=True)
        return Response(serializer.data)
    
class PatientDetails(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get(self,request, *args, **kwargs):
        patient_info = []
        id = kwargs.get('pk')
        doctor = None
        user = self.request.user
        if user.is_authenticated:
            doctor=user.username
        try:
            patient = Patient.objects.get(id=id)
            patient_docs = PatientDocument.objects.filter(patient=patient)
            queryset = Booking.objects.filter(patient=id, is_patient=True).order_by('-date')
            serialized_patient = self.get_serializer(patient).data
            completed_bookings = queryset.filter(
                Q(date__lt=date.today()) | 
                Q(date=date.today(), time__lt=datetime.now().time()),
                username=doctor,
                status='confirmed'
            )
            patient_detail = serialized_patient
            patient_document=PatientDocumentSerializer(patient_docs, many=True).data
            patient_bookings= BookingSerializer(completed_bookings, many=True).data
            response_data = {
            "status": "success",
            "data": {
                "patient_info": patient_detail,
                "patient_document":patient_document,
                "patient_bookings":patient_bookings
            }
        }
            return Response(response_data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)


class CurrencyView(generics.RetrieveUpdateAPIView):
    queryset = Configuration.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Configuration.objects.first()

class AllStaffView(generics.RetrieveUpdateAPIView):
    queryset = Staff.objects.all()
    serializer_class = StafflistSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        staff = Staff.objects.annotate(
            average_rating=Avg('feedback__rating', filter=Q(feedback__is_active=True)),
        )
        serializer = self.get_serializer(staff, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

stripe.api_key = settings.SECRET_KEY 
class PaymentIntentView(generics.GenericAPIView):
    permission_classes = [AllowAny]  

    def post(self, request, *args, **kwargs):
        amount = request.data.get("amount")  
        if not amount:
            return JsonResponse({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount, 
                currency="usd", 
                description="Payment for booking",
                shipping={
                    "name": "John Doe",
                    
                    "address": {
                      "line1": "123 Main Street",
                      "line2": "Suite 100",
                      "city": "Mumbai",
                      "state": "Maharashtra",
                      "postal_code": "400001",
                      "country": "IN"
                    }
  } 
            )
            return JsonResponse({"clientSecret": intent.client_secret})
        except stripe.error.StripeError as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
