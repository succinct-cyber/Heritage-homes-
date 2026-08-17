from django.contrib import admin

from .models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "title", "specialty_tag", "is_active", "display_order"]
    list_editable = ["display_order", "is_active"]
    search_fields = ["name", "title"]
    prepopulated_fields = {"slug": ("name",)}
