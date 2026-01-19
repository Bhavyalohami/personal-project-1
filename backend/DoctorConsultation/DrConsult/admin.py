from django.contrib import admin
from .models import *

# class ManagePages(admin.ModelAdmin):
#     list_display = ('title', 'content', 'slug')
#     prepopulated_fields = {'slug': ('title',)}

# Register your models here.
admin.site.register(Contact)
admin.site.register(ConsultationQueryM)
admin.site.register(Services)
admin.site.register(ManagePages) 
admin.site.register(CustomUser)
admin.site.register(Staff)



