import django_filters as filters

from .models import Property


class PropertyFilter(filters.FilterSet):
    """Every filter is independently combinable — applying one never resets another.
    Matches the catalog page spec: purchase type, category, price range, location."""

    purchase_type = filters.CharFilter(field_name="purchase_type", lookup_expr="iexact")
    category = filters.CharFilter(field_name="category__slug", lookup_expr="iexact")
    property_type = filters.CharFilter(field_name="property_type", lookup_expr="iexact")
    location = filters.CharFilter(method="filter_location")
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")
    bedrooms_min = filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    is_top_choice = filters.BooleanFilter(field_name="is_top_choice")

    class Meta:
        model = Property
        fields = [
            "purchase_type", "category", "property_type", "location",
            "price_min", "price_max", "bedrooms_min", "is_top_choice",
        ]

    def filter_location(self, queryset, name, value):
        from django.db.models import Q
        return queryset.filter(Q(area__icontains=value) | Q(city__icontains=value) | Q(state__icontains=value))
