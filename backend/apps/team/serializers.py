from rest_framework import serializers

from .models import TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = [
            "id", "name", "slug", "title", "specialty_tag",
            "photo", "email", "phone", "bio",
        ]

    def get_photo(self, obj):
        if obj.photo:
            request = self.context.get("request")
            url = obj.photo.url
            return request.build_absolute_uri(url) if request else url
        return obj.photo_url or None
