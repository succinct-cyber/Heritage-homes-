from rest_framework import mixins, viewsets

from .models import Inquiry
from .serializers import InquirySerializer


class InquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Write-only endpoint — the public site only ever creates inquiries.
    Staff review submissions in the Django admin."""

    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
