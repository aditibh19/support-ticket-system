# tickets/serializers.py
from rest_framework import serializers
from .models import Ticket
from .llm import classify_ticket_description

class TicketSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=Ticket.CATEGORY_CHOICES, required=False)
    priority = serializers.ChoiceField(choices=Ticket.PRIORITY_CHOICES, required=False)

    class Meta:
        model = Ticket
        fields = "__all__"

    def create(self, validated_data):
        description = validated_data.get("description")
        # Auto-classify only if not provided
        if not validated_data.get("category") or not validated_data.get("priority"):
            try:
                suggestion = classify_ticket_description(description)
                validated_data["category"] = suggestion.get("suggested_category", "general")
                validated_data["priority"] = suggestion.get("suggested_priority", "medium")
            except Exception:
                validated_data["category"] = "general"
                validated_data["priority"] = "medium"

        return super().create(validated_data)