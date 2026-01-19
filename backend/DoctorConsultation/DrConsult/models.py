from django.db import models, transaction
from django.utils.text import slugify
from datetime import datetime, timedelta, time
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.models import AbstractUser
from django.conf import settings



class CustomUser(AbstractUser):
    is_vendor = models.BooleanField(default=False)  
    roles = models.JSONField(default=list, blank=True, null=True)
    subroles = models.JSONField(default=list, blank=True, null=True)

    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  
        blank=True
    )

    class Meta:
        permissions = [
            ("can_change_is_active", "Can change the is_active status of other users"),
        ]
class VendorUser(models.Model):
    username = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='vendor', null=True)
    role = models.CharField(max_length=50)
    fname = models.CharField(max_length= 50)
    lname = models.CharField(max_length= 50)
    email = models.EmailField(max_length= 150)
    phone = models.CharField(max_length=10)
    address = models.TextField()
    gender = models.CharField(max_length=10)
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=60)
    country = models.CharField(max_length=60)
    code = models.CharField(max_length=6)


class Admin(models.Model):
    image = models.ImageField(upload_to='admin', null=True)
    username = models.CharField(max_length=50)
    role = models.CharField(max_length=50)
    fname = models.CharField(max_length= 50)
    lname = models.CharField(max_length= 50)
    email = models.EmailField(max_length= 150)
    phone = models.CharField(max_length=10)
    address = models.TextField()
    gender = models.CharField(max_length=10)
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=60)
    country = models.CharField(max_length=60)
    code = models.CharField(max_length=6)

    def __str__(self) -> str:
        return self.fname 
        
class Contact(models.Model):
    name = models.CharField(max_length=122)
    email = models.EmailField(max_length=122, default="N/A") 
    subject = models.CharField(max_length=122)
    phone = models.CharField(max_length=10,default="1234567890")
    message = models.TextField()
    
    def __str__(self) -> str:
        return self.name

class ConsultationQueryM(models.Model):
    name = models.CharField(max_length=122)
    email = models.EmailField(max_length=122, default=None) 
    contact = models.CharField(max_length=10)
    intrest = models.TextField()
    
    def __str__(self) -> str:
        return self.name

class Services(models.Model):
    name= models.CharField(max_length=122)
    text = models.CharField(max_length=200,default="N/A")
    date= models.DateField(auto_now_add=True)
    status = models.IntegerField(default=1)
    image=models.ImageField(upload_to="services" , null=True)
    def __str__(self) -> str:
        return self.name
    
class Blogs(models.Model):
    name= models.CharField(max_length=122)
    text = models.CharField(max_length=5000,default="N/A")
    date= models.DateField(auto_now_add=True)
    author=models.CharField(max_length=122)
    category=models.CharField(max_length=122)
    image=models.ImageField(upload_to="blogs", null=True)
    def __str__(self) -> str:
        return self.name
    
class Staff(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE,null=True, blank=True, default=None)
    fname= models.CharField(max_length=122)
    lname= models.CharField(max_length=122)
    username= models.CharField(max_length=122,default="N/A")
    gender= models.CharField(max_length=122,default="N/A")
    email= models.EmailField(max_length=122, default="N/A")
    role = models.CharField(max_length=200,default="N/A")
    date= models.DateField(auto_now_add=True)
    yoe = models.CharField(max_length=20,default="N/A")
    is_staff = models.BooleanField(default=False)
    address=models.CharField(max_length=300,blank=True,default="N/A" )
    city=models.CharField(max_length=122,blank=True,default="N/A")
    phone = models.CharField(max_length=10,default="1234567890")
    status = models.IntegerField(default=1)
    image=models.ImageField(upload_to="Staff", null=True)
    location = models.CharField(default="N/A", max_length=250)
    department = models.CharField(max_length=250, default="N/A")
    state = models.CharField(max_length=60,default="N/A")
    country = models.CharField(max_length=60,default="N/A")
    code = models.CharField(max_length=6,default="N/A")
    introduction = models.TextField(default="N/A")
    achievements = models.TextField(default="<p><br></p>")
    amount = models.IntegerField(default=500)

    def __str__(self) -> str:
        return self.fname

class Configuration(models.Model):
    new_logo = models.ImageField(upload_to='logos',null=True)
    new_favicon = models.ImageField(upload_to='favicons',null=True)
    facebook_url = models.URLField()
    twitter_url = models.URLField()
    instagram_url = models.URLField()
    linkedin_url = models.URLField()
    timings_weekday = models.CharField(max_length=50)
    timings_weekend = models.CharField(max_length=50)
    slogan_title = models.CharField(max_length=50)
    slogan_text = models.CharField(max_length=200, default='N/A')  
    company_name = models.CharField(max_length=50)  
    contact_number = models.CharField(max_length=10)
    email_address = models.EmailField(max_length=150, default=" ")
    address = models.TextField()
    currency_name = models.CharField(max_length=50, default=" ") 
    currency_symbol = models.CharField(max_length=50, default=" ") 

    def __str__(self) -> str:
        return self.company_name 

class ManagePages(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class ManageLocation(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    status = models.IntegerField(default=1)

    
class ManageDepartment(models.Model):
    name = models.CharField(max_length=200)
    status = models.IntegerField(default=1)

class ManageBlogCategories(models.Model):
    name = models.CharField(max_length=200)
    status = models.IntegerField(default=1)


### New Models ###
class DefaultSlot(models.Model):
    id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE) 
    day_of_week = models.CharField(max_length=10)
    slot_number = models.IntegerField(editable=False) 
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            existing_slots = DefaultSlot.objects.filter(day_of_week=self.day_of_week, doctor=self.doctor).order_by('slot_number')

            if not self.pk: 
                self.slot_number = existing_slots.count() + 1 
            else:  
                previous_slot_number = self.slot_number  
                super().save(*args, **kwargs)  
                
                if previous_slot_number != self.slot_number:
                    for slot in existing_slots:
                        if slot.slot_number >= previous_slot_number and slot.id != self.pk:
                            slot.slot_number += 1
                            slot.save()

            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            existing_slots = DefaultSlot.objects.filter(day_of_week=self.day_of_week, doctor=self.doctor).exclude(id=self.pk).order_by('slot_number')
            super().delete(*args, **kwargs) 
            
            for index, slot in enumerate(existing_slots):
                slot.slot_number = index + 1
                slot.save()

class SlotGenerationSetting(models.Model):
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE, null=True, blank=True)  
    number_of_days = models.IntegerField(null=True, blank=True)  
    check_days = models.BooleanField(default=False) 
    until_date = models.DateField(null = True,) 
    auto_generate = models.BooleanField(default=False) 
    last_generated_at = models.DateTimeField(default=None, null=True, blank=True) 

    def __str__(self):
        return f"Slot Generation Setting: {self.doctor.username}"

    def is_generation_needed(self):
        """
        Checks if slot generation is needed based on the settings.
        Returns True if slots need to be generated.
        """
        if self.check_days and self.number_of_days is not None:
            return True
            
        if self.until_date and timezone.now().date() <= self.until_date:
            return True

        if self.auto_generate:
            return True
        return False


class DateSlotModel(models.Model):
   
    id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.DateField()
    slot_number = models.IntegerField(editable=False) 
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
         with transaction.atomic():
             existing_slots = DateSlotModel.objects.filter(date=self.date, doctor=self.doctor).order_by('slot_number')
             
 
             if not self.pk: 
                 self.slot_number = existing_slots.count() + 1 
             else:  
                 previous_slot_number = self.slot_number  
                 super().save(*args, **kwargs)  
                 
                 if previous_slot_number != self.slot_number:
                     for slot in existing_slots:
                         if slot.slot_number >= previous_slot_number and slot.id != self.pk:
                             slot.slot_number += 1
                             slot.save()
 
             super().save(*args, **kwargs)

    def generate_sub_slots(self):
        SubSlotModel.objects.filter(date_slot=self).delete()

        

        start_time = datetime.strptime(self.start_time, "%H:%M:%S").time()
        end_time = datetime.strptime(self.end_time, "%H:%M:%S").time()  

       
            
        current_time = datetime.combine(self.date, start_time)
        end_datetime = datetime.combine(self.date, end_time)

        while current_time + timedelta(minutes=self.duration) <= end_datetime:
            next_time = current_time + timedelta(minutes=self.duration)
            SubSlotModel.objects.create(
                date_slot=self,
                start_time=current_time.time(),
                end_time=next_time.time(),
                is_active=True, 
                is_booked=False   
            )
            current_time = next_time
 
    def delete(self, *args, **kwargs):
        with transaction.atomic():
            
            existing_slots = DateSlotModel.objects.filter(date=self.date,doctor=self.doctor ).exclude(id=self.pk).order_by('slot_number')
            super().delete(*args, **kwargs) 
            
            for index, slot in enumerate(existing_slots):
                slot.slot_number = index + 1
                slot.save()
 
class SubSlotModel(models.Model):
    date_slot = models.ForeignKey(DateSlotModel, related_name='sub_slots', on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('date_slot', 'start_time', 'end_time')

class HolidayModel(models.Model):
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.DateField()
    comment = models.CharField(null=True, blank=True, max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)

class Booking(models.Model):
    
    STATUS_BOOKED = 'confirmed'
    STATUS_CANCELLED = 'cancelled'

    name = models.CharField(max_length=122)
    age = models.CharField(max_length=30)
    contact = models.CharField(max_length=10)
    email = models.EmailField(max_length=122)
    city = models.CharField(max_length=122)
    location = models.CharField(max_length=122, default=" ")
    department = models.CharField(max_length=122, default=" ")
    doctor = models.CharField(max_length=122, default=" ")
    date = models.DateField()
    time = models.CharField(max_length=30)
    gender = models.CharField(max_length=10)
    problem = models.TextField(default=" ",blank=True , null=True)
    username = models.CharField(max_length=60)
    today_appointments_count = models.IntegerField(default=0)
    sub_slot = models.ForeignKey(SubSlotModel, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=10, default=STATUS_BOOKED)
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, null=True, blank=True)
    is_patient = models.BooleanField(default=False)
    payment_status = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.name} - {self.doctor} ({self.date} {self.time})"
    
    def cancel_booking(self, user):
        
        if self.status == self.STATUS_BOOKED:
            if user.username == self.username or not (user.is_superuser or user.is_staff or user.is_vendor):
                try:
                    CancelledBooking.objects.create(
                        booking=self,
                        name=self.name,
                        age=self.age,
                        contact=self.contact,
                        email=self.email,
                        city=self.city,
                        location=self.location,
                        department=self.department,
                        doctor=self.doctor, 
                        date=self.date,
                        time=self.time,
                        gender=self.gender,
                        problem=self.problem,
                    )
                except IntegrityError as e:
                    print(f"IntegrityError: {e}")  
                    
                except Exception as e:
                    print(f"An error occurred: {e}") 

                self.status = self.STATUS_CANCELLED
                self.save()

                
                if self.sub_slot:
                    self.sub_slot.is_booked = False
                    self.sub_slot.save()
                    print("Slot has been freed.")
                else:
                    print("No sub_slot associated with this booking.")
                return True
            else:
                print("User is not authorized to cancel booking.")
                raise PermissionError("Only the assigned doctor can cancel the booking.")
        return False

class CancelledBooking(models.Model):
    booking = models.OneToOneField('Booking', on_delete=models.CASCADE)
    name = models.CharField(max_length=122)
    age = models.CharField(max_length=30)
    contact = models.CharField(max_length=10)
    email = models.EmailField(max_length=122)
    city = models.CharField(max_length=122)
    location = models.CharField(max_length=122, default="N/A")
    department = models.CharField(max_length=122, default="N/A")
    doctor = models.CharField(max_length=122, default="N/A")
    date = models.DateField()  
    time = models.CharField(max_length=30)  
    gender = models.CharField(max_length=10)
    problem = models.TextField()  
    cancelled_at = models.DateTimeField(auto_now_add=True)  
    def __str__(self):
        return f"Cancelled Booking {self.booking.id} - {self.name}"

class Notification(models.Model):
    doctor = models.CharField(max_length=20)  
    message = models.TextField()
    notification_type = models.CharField(max_length=20, default="Booking")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.doctor} - {self.message[:50]}"

class Patient(models.Model):
    username = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=122, default="N/A")
    date_of_birth = models.DateField(null=True, blank=True,default="1990-01-01")
    gender = models.CharField(max_length=10,null=True,default="N/A")
    age = models.CharField(max_length=30,null=True,blank=True,default="N/A")
    image = models.ImageField(upload_to="patients", null=True)
    contact = models.CharField(max_length=10, default="N/A")
    email = models.EmailField(max_length=122, default="N/A")
    address = models.CharField(max_length=122, default="N/A")
    city = models.CharField(max_length=122, default="N/A")
    state = models.CharField(max_length=60, default="N/A")
    zipcode = models.CharField(max_length=6,default="N/A")
    blood_group = models.CharField(max_length=10, default="N/A")

    def __str__(self):
        return f"{self.name}"

class PatientDocument(models.Model):
   
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True,related_name="documents")
    document_name = models.CharField(max_length=100)  
    document_file = models.FileField(upload_to='patient_documents/')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.username} - {self.document_name}"

    class Meta:
        verbose_name = "Patient Document"
        verbose_name_plural = "Patient Documents"

class Feedback(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    review = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.username}"

class SetupNotificationsDetails(models.Model):
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    whatsapp_account_SID = models.CharField(max_length=100, blank=True, null=True)
    whatsapp_auth_token = models.CharField(max_length=100, blank=True, null=True)
    email=models.EmailField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.email}"
