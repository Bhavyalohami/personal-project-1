from rest_framework import serializers
from DrConsult.models import CustomUser
from django.contrib.auth.hashers import make_password
from ..models import *
from datetime import datetime, timedelta, time
from django.utils.timezone import now
from django.db.models import Avg, Q

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class ConsultationQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationQueryM
        fields = '__all__'

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'

class BlogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blogs
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):

    class Meta:
        model = Staff
        fields = '__all__'  

class StafffSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Staff
        fields = ['id','fname', 'lname', 'username', 'status'] 
   



class LogoChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['new_logo']

class FaviconChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['new_favicon']

class TimingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['timings_weekday', 'timings_weekend']

class SloganSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['slogan_title', 'slogan_text']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['currency_name', 'currency_symbol']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['email_address', 'address', 'contact_number', 'company_name']


class SocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url']


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    doctor_id = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = '__all__'

    def get_doctor_id(self, obj):
        if obj.username: 
            try:
                doctor = Staff.objects.get(username=obj.username)
                return doctor.id  
            except Staff.DoesNotExist:
                return None 
        return None

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)
    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords must match.")
        return data

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class RegisterStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Create a new user with the is_staff=True flag
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            is_staff=True
        )
        return user

class RegisterVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'is_staff']

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            is_vendor=True,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_staff=validated_data['is_staff'],
        )
        return user

class RegisterPatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            is_staff=False
        )
        return user

 
class ManagePagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagePages
        fields = '__all__'

class ManageLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageLocation
        fields = '__all__'


class ManageDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageDepartment
        fields = '__all__'

class ManageBlogCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageBlogCategories
        fields = '__all__'


#### New model serializers ####

class DefaultSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultSlot
        fields = '__all__'

class SlotGenerationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotGenerationSetting
        fields = '__all__'

class SubSlotSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(format='%H:%M')
    end_time = serializers.TimeField(format='%H:%M')

    class Meta:
        model = SubSlotModel
        fields = ['id', 'start_time', 'end_time', 'is_active', 'is_booked']


class DateSlotSerializer(serializers.ModelSerializer):
    sub_slots = SubSlotSerializer(many=True, read_only=True)
    start_time = serializers.TimeField(format='%H:%M')
    end_time = serializers.TimeField(format='%H:%M')

    class Meta:
        model = DateSlotModel
        fields = ['id', 'slot_number', 'start_time', 'end_time', 'duration', 'sub_slots']

class HolidayModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidayModel
        fields = '__all__'

class CancelledBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancelledBooking
        fields = '__all__' 
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PatientDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = PatientDocument
        fields = '__all__'
    def get_file_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.document_file.url)
        return obj.document_file.url
class VendorUserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = VendorUser
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            image_url = obj.image.url
            if request:
                return request.build_absolute_uri(image_url)
            else:
                # Fallback (optional): hardcoded domain
                return f'https://doctor-appointment-software.logicspice.com{image_url}'
        return None

class ChangeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class PatientFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'image']

# class FeedbackSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Feedback
#         fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)  # Assuming Patient has a `name` field
    doctor_name = serializers.CharField(source='doctor.fname', read_only=True)    # Assuming Staff has a `name` field

    class Meta:
        model = Feedback
        fields = ['id', 'patient_name', 'doctor_name', 'review', 'rating', 'is_active', 'created_at']

class FeedbackPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['doctor', 'patient', 'review', 'rating']  

class FeedbackGetSerializer(serializers.ModelSerializer):
    doctor = StaffSerializer()  
    patient = PatientFeedbackSerializer(read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'

class RolesSerializer(serializers.Serializer):
    roles = serializers.DictField()
    subroles = serializers.DictField()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class SetupNotificationsDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SetupNotificationsDetails
        fields = '__all__'

class StafflistSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()    
    class Meta:
        model = Staff
        fields = [
            'id', 
            'fname', 
            'lname', 
            'username', 
            'gender', 
            'email', 
            'role', 
            'date', 
            'yoe', 
            'is_staff', 
            'address', 
            'city', 
            'phone', 
            'status', 
            'image', 
            'location', 
            'department', 
            'state', 
            'country', 
            'code', 
            'introduction', 
            'achievements', 
            'amount', 
            'average_rating',  
           
        ]

    def get_average_rating(self, obj):
        average = Feedback.objects.filter(
            doctor=obj,
            is_active=True
        ).aggregate(Avg('rating'))['rating__avg']
        return round(average, 2) if average is not None else None
