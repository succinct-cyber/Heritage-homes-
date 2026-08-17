from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import PropertyFilter
from .models import Category, Property
from .serializers import (
    CategorySerializer,
    PropertyCardSerializer,
    PropertyDetailSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None  # small fixed list — frontend expects a plain array, not {count, results}


class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    /api/properties/                 -> catalog grid (paginated, filterable, sortable)
    /api/properties/{slug}/          -> full detail page payload
    /api/properties/{slug}/similar/  -> 'Similar Properties' grid (same category/purchase type)
    /api/properties/featured/        -> homepage 'Featured Property' grid
    """

    queryset = Property.objects.filter(is_published=True).select_related("category").prefetch_related("images")
    filterset_class = PropertyFilter
    search_fields = ["title", "area", "city", "summary"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyCardSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:6]
        serializer = PropertyCardSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def similar(self, request, slug=None):
        prop = self.get_object()
        qs = self.get_queryset().filter(
            category=prop.category, purchase_type=prop.purchase_type
        ).exclude(pk=prop.pk)[:3]
        serializer = PropertyCardSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)