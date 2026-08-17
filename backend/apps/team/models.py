from django.db import models
from django.utils.text import slugify


class TeamMember(models.Model):
    """A single firm's staff — not individual marketplace-style agent profiles.
    Used for the 'Meet The Team' grid only (no dedicated detail page)."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    title = models.CharField(max_length=120, help_text="e.g. Senior Consultant, Principal Partner")
    specialty_tag = models.CharField(max_length=40, help_text="e.g. COMMERCIAL, RESIDENTIAL, PORTFOLIO MGT")
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    photo_url = models.URLField(
        blank=True,
        help_text="Dev-mode fallback: an external image URL used when no file is uploaded to photo.",
    )
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True, help_text="Optional short bio for an inline expand — no dedicated page.")
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
