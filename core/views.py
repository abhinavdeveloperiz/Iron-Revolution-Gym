from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import render, redirect

from core.forms import EnquiryForm


def home(request):
    return render(request, "core/home.html", {"meta_title": f"{settings.GYM_NAME} | Home"})


def about(request):
    return render(
        request, "core/about.html", {"meta_title": f"About Us | {settings.GYM_NAME}"}
    )


def services(request):
    return render(
        request,
        "core/services.html",
        {"meta_title": f"Services & Membership Plans | {settings.GYM_NAME}"},
    )


def gallery(request):
    return render(
        request, "core/gallery.html", {"meta_title": f"Gallery | {settings.GYM_NAME}"}
    )


def contact(request):
    """Contact page: business info + Google Map + the sitewide Enquiry Form."""
    if request.method == "POST":
        form = EnquiryForm(request.POST)
        if form.is_valid():
            enquiry = form.save()

            # Email the submission to the 1 Official Mail ID
            send_mail(
                subject=f"New Enquiry from {enquiry.name} — {settings.GYM_NAME}",
                message=(
                    f"Name: {enquiry.name}\n"
                    f"Phone: {enquiry.phone}\n"
                    f"Email: {enquiry.email}\n"
                    f"Interested Service: {enquiry.get_service_display()}\n\n"
                    f"Message:\n{enquiry.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ENQUIRY_RECEIVER_EMAIL],
                fail_silently=True,
            )

            messages.success(
                request, "Thank you! Our team will contact you shortly."
            )
            return redirect("contact")
    else:
        form = EnquiryForm()

    return render(
        request,
        "core/contact.html",
        {"form": form, "meta_title": f"Contact Us | {settings.GYM_NAME}"},
    )
