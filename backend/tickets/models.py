from django.db import models


class Ticket(models.Model):

    CATEGORY_CHOICES = [
        ("billing", "Billing"),
        ("technical", "Technical"),
        ("account", "Account"),
        ("general", "General"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    title = models.CharField(
        max_length=200,
        null=False,
        blank=False,
    )

    description = models.TextField(
        null=False,
        blank=False,
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="general",
        db_index=True,
        null=False,
        blank=False,
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="medium",
        db_index=True,
        null=False,
        blank=False,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open",
        db_index=True,
        null=False,
        blank=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title