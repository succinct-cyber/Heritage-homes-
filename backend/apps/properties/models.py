from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """e.g. Luxury Houses, Prime Lands, Family Homes, Apartments, Office Space, Villas, Condos"""

    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)
    icon = models.CharField(
        max_length=40,
        default="building",
        help_text="Icon key the frontend maps to a line-icon component, e.g. 'building', 'land', 'villa', 'condo'.",
    )
    description = models.CharField(max_length=280, blank=True)
    hero_image = models.ImageField(upload_to="categories/", blank=True, null=True)
    hero_image_url = models.URLField(
        blank=True,
        help_text="Dev-mode fallback: an external image URL used when no file is uploaded to hero_image.",
    )
    badge_label = models.CharField(
        max_length=40, blank=True, help_text="e.g. 'PREMIUM SELECTION' shown on the featured category card."
    )
    is_specific_need = models.BooleanField(
        default=False,
        help_text="True for the 4 small 'Specific Needs' cards (Apartments, Office Space, Villas, Condos).",
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def listing_count(self):
        return self.properties.count()


class Amenity(models.Model):
    name = models.CharField(max_length=80, unique=True)
    icon = models.CharField(max_length=40, default="check")

    class Meta:
        verbose_name_plural = "Amenities"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Property(models.Model):
    class PurchaseType(models.TextChoices):
        SALE = "sale", "For Sale"
        RENT = "rent", "For Rent"
        LEASE = "lease", "Lease / Hire"

    class RentPeriod(models.TextChoices):
        NIGHT = "night", "/night"
        DAY = "day", "/day"
        YEAR = "year", "/yr"
        MONTH = "month", "/mo"

    class PropertyType(models.TextChoices):
        DETACHED = "detached", "Detached House"
        SEMI_DETACHED = "semi_detached", "Semi-Detached"
        APARTMENT = "apartment", "Luxury Apartment"
        VILLA = "villa", "Villa"
        CONDO = "condo", "Condo"
        LAND = "land", "Land"
        OFFICE = "office", "Office Space"
        WAREHOUSE = "warehouse", "Warehouse"
        EVENT_CENTER = "event_center", "Event Center"

    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="properties")

    purchase_type = models.CharField(max_length=10, choices=PurchaseType.choices, default=PurchaseType.SALE)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices, default=PropertyType.DETACHED)

    price = models.DecimalField(max_digits=14, decimal_places=2)
    rent_period = models.CharField(
        max_length=10, choices=RentPeriod.choices, blank=True,
        help_text="Only used when purchase_type is rent or lease, e.g. /night, /yr, /day.",
    )

    area = models.CharField(max_length=80, help_text="e.g. Ikoyi, Victoria Island, Maitama")
    city = models.CharField(max_length=80, help_text="e.g. Lagos, Abuja")
    state = models.CharField(max_length=80, blank=True)
    full_address = models.CharField(max_length=220, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    size_sqm = models.PositiveIntegerField(null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)

    summary = models.CharField(max_length=280, blank=True, help_text="Short description shown on cards.")
    description = models.TextField(blank=True, help_text="Full 'Property Overview' body copy, paragraphs.")
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="properties")

    is_top_choice = models.BooleanField(default=False, help_text="Shows the green 'TOP CHOICE' ribbon badge.")
    is_featured = models.BooleanField(default=False, help_text="Shown in the homepage 'Featured Property' grid.")
    is_published = models.BooleanField(default=True)

    listed_by = models.ForeignKey(
        "team.TeamMember", on_delete=models.SET_NULL, null=True, blank=True, related_name="listings"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Property.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def location(self):
        return f"{self.area}, {self.city}" if self.city else self.area


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/", blank=True, null=True)
    image_url = models.URLField(
        blank=True,
        help_text="Dev-mode fallback: an external image URL used when no file is uploaded to image.",
    )
    caption = models.CharField(max_length=140, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.property.title} — image {self.display_order}"
