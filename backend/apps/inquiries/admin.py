from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "property", "team_member", "is_resolved", "created_at"]
    list_filter = ["is_resolved", "created_at"]
    search_fields = ["full_name", "email", "message"]
