from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, PropertyViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"", PropertyViewSet, basename="property")

urlpatterns = router.urls
