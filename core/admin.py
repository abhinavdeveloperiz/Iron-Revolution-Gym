from django.contrib import admin
from core.models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "service", "created_at")
    list_filter = ("service", "created_at")
    search_fields = ("name", "phone", "email")
    readonly_fields = ("created_at",)
