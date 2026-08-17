from django.contrib import admin

from .models import Amenity, Category, Property, PropertyImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_specific_need", "listing_count", "display_order"]
    list_editable = ["display_order", "is_specific_need"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ["name", "icon"]
    search_fields = ["name"]


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "title", "category", "purchase_type", "price", "location",
        "is_top_choice", "is_featured", "is_published",
    ]
    list_filter = ["purchase_type", "category", "is_top_choice", "is_featured", "is_published"]
    search_fields = ["title", "area", "city"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PropertyImageInline]
    filter_horizontal = ["amenities"]
