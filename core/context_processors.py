from django.conf import settings


def business_info(request):
    """Makes the gym's business details available in every template as
    {{ GYM_NAME }}, {{ GYM_PHONE }}, {{ GYM_WHATSAPP_NUMBER }}, etc.
    Edit the values in settings.py (or your .env) — never hard-code them
    in templates — so every page stays in sync.
    """
    return {
        "GYM_NAME": settings.GYM_NAME,
        "GYM_TAGLINE": settings.GYM_TAGLINE,
        "GYM_PHONE": settings.GYM_PHONE,
        "GYM_WHATSAPP_NUMBER": settings.GYM_WHATSAPP_NUMBER,
        "GYM_EMAIL": settings.GYM_EMAIL,
        "GYM_ADDRESS": settings.GYM_ADDRESS,
        "GYM_HOURS": settings.GYM_HOURS,
        "SOCIAL_FACEBOOK": settings.SOCIAL_FACEBOOK,
        "SOCIAL_INSTAGRAM": settings.SOCIAL_INSTAGRAM,
        "SOCIAL_YOUTUBE": settings.SOCIAL_YOUTUBE,
        "SOCIAL_TWITTER": settings.SOCIAL_TWITTER,
        "GOOGLE_MAP_EMBED_URL": settings.GOOGLE_MAP_EMBED_URL,
    }
