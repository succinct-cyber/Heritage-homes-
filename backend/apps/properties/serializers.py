from rest_framework import serializers

from .models import Amenity, Category, Property, PropertyImage


class CategorySerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    listing_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "icon", "description", "hero_image",
            "badge_label", "is_specific_need", "listing_count",
        ]

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get("request")
            url = obj.hero_image.url
            return request.build_absolute_uri(url) if request else url
        return obj.hero_image_url or None


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon"]


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "caption", "is_primary", "display_order"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return obj.image_url or None


class PropertyCardSerializer(serializers.ModelSerializer):
    """Lightweight shape used everywhere a property renders as a CARD:
    homepage featured grid, catalog grid, rent & hire grid, similar properties."""

    location = serializers.ReadOnlyField()
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    purchase_type_display = serializers.CharField(source="get_purchase_type_display", read_only=True)
    rent_period_display = serializers.CharField(source="get_rent_period_display", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "slug", "title", "location", "area", "city", "category",
            "purchase_type", "purchase_type_display", "price", "rent_period",
            "rent_period_display", "bedrooms", "bathrooms", "size_sqm",
            "is_top_choice", "is_featured", "primary_image", "summary",
        ]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if not img:
            return None
        if img.image:
            url = img.image.url
            return request.build_absolute_uri(url) if request else url
        return img.image_url or None


class PropertyDetailSerializer(serializers.ModelSerializer):
    location = serializers.ReadOnlyField()
    category = CategorySerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    purchase_type_display = serializers.CharField(source="get_purchase_type_display", read_only=True)
    rent_period_display = serializers.CharField(source="get_rent_period_display", read_only=True)
    property_type_display = serializers.CharField(source="get_property_type_display", read_only=True)
    listed_by = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id", "slug", "title", "location", "area", "city", "state", "full_address",
            "latitude", "longitude", "category", "purchase_type", "purchase_type_display",
            "property_type", "property_type_display", "price", "rent_period", "rent_period_display",
            "size_sqm", "bedrooms", "bathrooms", "summary", "description", "amenities",
            "is_top_choice", "images", "listed_by", "created_at",
        ]

    def get_listed_by(self, obj):
        if not obj.listed_by:
            return None
        return {
            "id": obj.listed_by.id,
            "name": obj.listed_by.name,
            "title": obj.listed_by.title,
        }
