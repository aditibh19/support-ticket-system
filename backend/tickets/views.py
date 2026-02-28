# tickets/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from django.db.models.functions import TruncDate

from .models import Ticket
from .serializers import TicketSerializer
from .llm import classify_ticket_description

# -----------------------
# Pagination Class
# -----------------------
class TicketPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer
    filterset_fields = ["category", "priority", "status"]
    search_fields = ["title", "description"]
    pagination_class = TicketPagination

    # Stats endpoint
    @action(detail=False, methods=["get"])
    def stats(self, request):
        total = Ticket.objects.count()
        open_count = Ticket.objects.filter(status="open").count()

        priority_breakdown = dict(
            Ticket.objects.values("priority")
            .annotate(count=Count("id"))
            .values_list("priority", "count")
        )

        category_breakdown = dict(
            Ticket.objects.values("category")
            .annotate(count=Count("id"))
            .values_list("category", "count")
        )

        per_day = (
            Ticket.objects.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        )

        avg_per_day = (
            sum(x["count"] for x in per_day) / len(per_day)
            if per_day else 0
        )

        return Response({
            "total_tickets": total,
            "open_tickets": open_count,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })

    # LLM classify endpoint
    @action(detail=False, methods=["post"])
    def classify(self, request):
        description = request.data.get("description")
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = classify_ticket_description(description)
            return Response(result)
        except Exception:
            return Response({"suggested_category": "general", "suggested_priority": "medium"})