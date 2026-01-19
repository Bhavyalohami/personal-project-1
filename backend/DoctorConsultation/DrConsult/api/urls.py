from django.urls import path
from .views import * 


urlpatterns = [
    #contactform
    #path('', index_view, name='index'),
    path('contact-form-list/',ContactList.as_view(),name='contactlist'),
    path('submit-contact/',ContactList.as_view(),name='submitcontact'),
    path('contact-form-list/<int:pk>/', DeleteContact.as_view(), name='contact-detail'),
    #Consultation Query
    path('consultation-query/',ConsultationQuery.as_view(),name='consultation'),
    path('consultation-query/<int:pk>', DelQuery.as_view(), name='consultation-detail'),
    #Services
    path('latest-services/', LatestServicesView.as_view(), name='latest-services'),
    path('services-list/',ServicesView.as_view(),name='serviceslist'),
    path('submit-service/',ServicesView.as_view(),name='submitservice'),
    path("services-list/<int:pk>/",ServiceDetailView.as_view(), name="detail-service"),
    path("delete-services/<int:pk>/",ServiceDeleteView.as_view(), name="delete-service"),
    path('services-list/<int:id>/toggle-status/', ServicesView.as_view(), name='toggle-service-status'),
    #blogs
    path('blogs-list/',BlogsView.as_view(),name='blogslist'),
    path('submit-blog/',BlogsView.as_view(),name='submitblog'),
    path("blogs-list/<int:pk>/",BlogDetailView.as_view(), name="detail-blog"),
    path("delete-blog/<int:pk>/",BlogDeleteView.as_view(), name="delete-blogs"),
    #Staff
    path('staff-list/',StaffView.as_view(),name='stafflist'),
    path('submit-staff/',StaffView.as_view(),name='submitstaff'),
    path('staff-list/<int:pk>/',StaffDetailView.as_view(),name='staff-detail'),
    path("delete-staff/<int:pk>/",StaffDeleteView.as_view(), name="delete-staff"),
    path('staff-list/<str:username>/', SingleStaffView.as_view(), name='toggle-staff-status'),
    path('staff-list/<int:id>/toggle-status/', StaffView.as_view(), name='toggle-staff-status'),
    path('toggle-user-status/', StaffToggleStatusView.as_view(), name='toggle-user-status'),
    #configurations
    path('logochange/', LogoChangeView.as_view(), name='logochange'),
    path('faviconchange/', FaviconChangeView.as_view(), name='faviconchange'),
    path('timings/', TimingsView.as_view(), name='timings'),
    path('slogan/', SloganView.as_view(), name='slogan'),
    path('configurations/', ConfigurationsView.as_view(), name='configurations'),
    path('address/',AddressView.as_view(), name='address'),
    path('socialmediaprofile/',SocialMediaView.as_view(), name='socialmedia'),
    path('currency/',CurrencyView.as_view(), name='contactinfo'),
    #booking
    path('booking/',BookingView.as_view(), name='booking'),
    path('submit-appointment/',BookingView.as_view(),name='submitservice'),
    path("bookings-list/<int:pk>/",BookingDetailView.as_view(), name="detail-service"),
    path("delete-booking/<int:pk>/",BookingDeleteView.as_view(), name="delete-booking"),
    path('booking/<str:username>/', DoctorBookingView.as_view(),name="doctor-booking"),
    ###Cancel Booking
    path('cancel-booking/<int:pk>/', CancelBookingView.as_view(),name="cancel-booking"),
    #admin
    path("admin/", AdminView.as_view(), name='admin'),
    path('changepassword/', ChangePasswordView.as_view(), name='changepassword'),
    path('login/', LoginView.as_view(), name='login'),
    #RegisterStaff
    path('register-staff/', RegisterStaffView.as_view(), name='register_staff'), 
    #managecontent
    path('managepages/', ManagePagesView.as_view(), name='manage'),
    path('managepages/<slug:slug>/',ManageSinglePageView.as_view(), name='manage-singlepage'),
    #managelocation
    path('managelocation/', ManageLocationView.as_view(), name='managelocation'),
    path('managelocation/<int:pk>/',LocationDetailView.as_view(),name='location-detail'),
    path("delete-location/<int:pk>/",LocationDeleteView.as_view(), name="delete-location"),
    path('managelocation/<int:id>/toggle-status/', ManageLocationView.as_view(), name='toggle-location-status'),
    #managedepartment
    path('managedepartment/', ManageDepartmentView.as_view(), name='managedepartment'),
    path('managedepartment/<int:pk>/',DepartmentDetailView.as_view(), name='department-detail'),
    path("delete-department/<int:pk>/", DepartmentDeleteView.as_view(), name="delete-department"),
    path('managedepartment/<int:id>/toggle-status/', ManageDepartmentView.as_view(), name='toggle-department-status'),
    #manageblogcategories
    path('manageblogcategories/', ManageBlogCategoriesView.as_view(), name='manageblogcategories'),
    path('manageblogcategories/<int:id>/toggle-status/', ManageBlogCategoriesView.as_view(), name='toggle-blogcategories-status'),
    path('manageblogcategories/<int:pk>/',BlogCategoryDetailView.as_view(), name='blogcategory-detail'),
    path("delete-blogcategories/<int:pk>/", BlogCategoryDeleteView.as_view(), name="delete-blogcategory"),

    #########new urls#################
    #Defaultslot
    path('defaultslots/', DefaultSlotListCreateView.as_view(), name='defaultslot-list-create'),
    path('defaultslots/<int:pk>/', DefaultSlotRetrieveUpdateDestroyView.as_view(), name='defaultslot-retrieve-update-destroy'),
    path('defaultslots/<str:day_of_week>/', DefaultDayView.as_view(), name='default_day_view'),
    #defaultsettings
    path('defaultsettings/', SlotGenerationSettingViewSet.as_view(), name='post_setting_view'),
    # path('defaultsettings/<int:pk>/',SlotGenerationSettingPutViewSet.as_view(),name='put_settings_view'),
    #Manage-Slots
    path('dateslots/<str:date>/',DateSlotListView.as_view(), name='manageslot-list-create'),
    path('allslots/', AllSlotsView.as_view(), name='all_slots'),
    path('doctormonthlyslots/<str:username>/<int:year>/<int:month>/', DoctorMonthlySlotsView.as_view(), name='doctor_date_slots'),
    path('monthly/<int:year>/<int:month>/', MonthlySlotsView.as_view(), name='monthly_slots'),
    path('doctorlist/',GetDoctorsView.as_view(), name='doctor_list'),
    #DateslotManipulation
    path('dateslot/<int:pk>/', DateSlotManipulationAPIView.as_view(), name='date_slot_manipulation'),
    path('datesubslot/<int:pk>/', DateSubSlotManipulationAPIView.as_view(), name='dateslot-retrieve-update-destroy'),
    #### ManageHolidays
    path('manageholiday/', HolidayListCreateView.as_view(), name='manageholiday'),
    path('manageholiday/<str:username>/', HolidayRetrieveView.as_view(), name='holiday_retrieve'),
    ##generateslotview
    path('generateslots/', GenerateSlotsView.as_view(), name='generate_slots'),
    ##getNotification
    path('get-notification/<str:username>/', NotificationListView.as_view(), name='get_notification'),
    path('notifications/mark-as-read/<int:notification_id>/', MarkNotificationAsReadView.as_view(), name='mark_notification_as_read'),
    #########Patients################
    path('register-patient/', RegisterPatientView.as_view(), name='register'),
    path('check-username/', CheckUsernameView.as_view(), name='check_username'),
    path('patient-login/', PatientLoginView.as_view(), name='patient'),
    path('patient-activation/<str:username>/', AccountConfirmationView.as_view(), name='account-confirmation'),
    path('patient-profile/<str:username>/', SinglePatientProfileView.as_view(), name='patient_profile'),
    #########PatientsBookingHistory################
    path('patient-booking-history/', PatientBookingHistoryView.as_view(), name='patient_booking_history'),
    path('documents/', PatientDocumentListView.as_view(), name='document-list'),  
    path('upload-document/', PatientDocumentCreateView.as_view(), name='document-upload'),  
    path('documents/<int:pk>/', PatientDocumentDetailView.as_view(), name='document-detail'), 
    #########Vendor################
    path('register-vendor/', RegisterVendorView.as_view(), name='register_vendor'),
    path('vendor-login/', VendorLoginView.as_view(), name='vendor'),
    path('vendor-profile/<str:username>/', VendorProfileView.as_view(), name='vendor_profile'),
    path('vendor-profile-view/<int:pk>/', VendorInformationView.as_view(), name='vendor_account_confirmation'),
    path('vendor-profile/', VendorProfile.as_view(), name='vendor_profile'),
    path('change-vendor-status/<int:pk>/', ChangeStatusView.as_view(), name='change_vendor_status'),
    ###############Feedback################
    path('feedback/', FeedbackView.as_view(), name='feedback'),
    path('feedback-list/<int:pk>/', DetailFeedbackView.as_view(), name='feedback-detail'),
    path('feedback-list/',ManageFeedbackView.as_view(), name='manage-feedback'),
    path('feedback/<int:id>/status/', ManageFeedbackStatus.as_view(), name='feedback-status'),
    ####DashBoard###
    path('dashboard/<str:username>/', UserDashboardDetailView.as_view(), name='user-dashboard'),
    path('graphs/', GraphsView.as_view(), name='graphs'),
    path('weekly-graphs/', WeeklyView.as_view(), name='graphs'),
    ########Roles##########
    path('roles/<str:username>/', RolesView.as_view(), name='roles'),
    path('update-roles/', UpdateRolesView.as_view(), name='update-roles'),
    path('proxy/geo-names/', ProxyGeoNamesView.as_view(), name='proxy_geo_names'),
    ############## Manage Patients ###################
    path('patient-list/', PatientView.as_view(), name='patient-list'),
    path('patient-list/<int:pk>/', PatientDeleteView.as_view(), name='patient-delete'),
    path('patient-list/toggle-status/', PatientAccountView.as_view(), name='toggle-patient-status'),
    path('patient-list-update/<int:id>/', SinglePatientView.as_view(), name='toggle-patient-status'),
    path('setupnotifications/', SetupNotificationsView.as_view(), name='setup-notifications'),
    path('home-search-staff/', StaffSearchView.as_view(), name='search-staff'),
    path('patient-details/<int:pk>/',PatientDetails.as_view(),name='patient-details'),
    path('allstaff/', AllStaffView.as_view(), name='allstaff'),
    path('PayWithStripe/', PaymentIntentView.as_view(), name='pay-with-stripe'),
   ]