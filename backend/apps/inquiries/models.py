from django.db import models


class Inquiry(models.Model):
    """Powers both the property detail 'Send Inquiry' form and the
    Meet The Team 'Contact' buttons — a single unified lead-capture model,
    since this is one firm and inquiries route to the firm, not a specific agent's inbox."""

    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()

    property = models.ForeignKey(
        "properties.Property", on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiries"
    )
    team_member = models.ForeignKey(
        "team.TeamMember", on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiries"
    )

    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Inquiries"

    def __str__(self):
        target = self.property or self.team_member or "General"
        return f"{self.full_name} → {target}"
