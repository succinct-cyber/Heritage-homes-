from rest_framework import viewsets

from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only — this is the single shared 'Meet The Team' grid, no individual
    profile detail route, since this firm doesn't run per-agent marketplace pages."""

    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    lookup_field = "slug"
    pagination_class = None  # small fixed list — frontend expects a plain array, not {count, results}