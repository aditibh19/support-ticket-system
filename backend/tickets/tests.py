# tickets/tests.py
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Ticket

class TicketAPITestCase(APITestCase):

    def setUp(self):
        # Create sample tickets
        Ticket.objects.create(title="Billing issue", description="Double charge", category="billing", priority="high")
        Ticket.objects.create(title="Login problem", description="Cannot login", category="technical", priority="medium")

    def test_list_tickets(self):
        response = self.client.get("/api/tickets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_create_ticket(self):
        data = {"title": "New ticket", "description": "Something wrong"}
        response = self.client.post("/api/tickets/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("category", response.data)
        self.assertIn("priority", response.data)

    def test_update_ticket_status(self):
        ticket = Ticket.objects.first()
        response = self.client.patch(f"/api/tickets/{ticket.id}/", {"status": "resolved"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ticket.refresh_from_db()
        self.assertEqual(ticket.status, "resolved")

    def test_stats_endpoint(self):
        response = self.client.get("/api/tickets/stats/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_tickets", response.data)
        self.assertIn("priority_breakdown", response.data)