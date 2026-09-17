import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Creates a superuser from DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD "
        "env vars if one doesn't already exist. Safe to run on every deploy — this "
        "exists because Render's free web service plan has no Shell access, so "
        "'createsuperuser' can't be run interactively."
    )

    def handle(self, *args, **options):
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            self.stdout.write(self.style.WARNING(
                "DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD not set — skipping."
            ))
            return

        if User.objects.filter(email__iexact=email).exists():
            self.stdout.write(f"Superuser '{email}' already exists — leaving as-is.")
            return

        User.objects.create_superuser(username=email, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created superuser '{email}'."))