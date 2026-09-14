from django.db import models


class Enquiry(models.Model):
    """Stores every submission of the sitewide Enquiry Form."""

    SERVICE_CHOICES = [
        ("membership_plan", "Membership & Day Pass Trial"),
        ("personal_training", "1-on-1 Master Coaching & Assessment"),
        ("biometric_scan", "InBody 570 Biometric Scan"),
        ("nutrition_consultation", "Nutrition & Pro Shop Order"),
        ("group_classes", "Corporate & Group Strength Program"),
        ("other", "General Enquiry & Facility Access"),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    service = models.CharField(
        max_length=30, choices=SERVICE_CHOICES, blank=True, default="other"
    )
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Enquiries"

    def __str__(self):
        return f"{self.name} ({self.phone}) — {self.get_service_display()}"
