"""
Django settings for iron_revolution project.
Gym Website — 5-page business site (Home, About, Services, Gallery, Contact)
Built to satisfy the fixed deliverables list only (no extra features added).
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# --- tiny built-in .env loader (no extra dependency required) ---------
_env_file = BASE_DIR / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _key, _value = _line.split("=", 1)
        os.environ.setdefault(_key.strip(), _value.strip())

# -----------------------------------------------------------------------
# SECURITY
# -----------------------------------------------------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "replace-this-with-a-real-secret-key")

DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# -----------------------------------------------------------------------
# APPLICATION DEFINITION
# -----------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "iron_revolution.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # injects GYM_* business-detail placeholders into every template
                "core.context_processors.business_info",
            ],
        },
    },
]

WSGI_APPLICATION = "iron_revolution.wsgi.application"

# -----------------------------------------------------------------------
# DATABASE  (SQLite by default — swap for MySQL/Postgres on real hosting)
# -----------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# -----------------------------------------------------------------------
# PASSWORD VALIDATION
# -----------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -----------------------------------------------------------------------
# INTERNATIONALIZATION
# -----------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# -----------------------------------------------------------------------
# STATIC & MEDIA
# (original template's css/js/fonts/img copied verbatim — design unchanged)
# -----------------------------------------------------------------------
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"   # used by `collectstatic` on the live server

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -----------------------------------------------------------------------
# EMAIL  — Enquiry Form submissions are mailed to the 1 official mail ID.
# Fill these in with the real server SMTP details given by your host.
# -----------------------------------------------------------------------
EMAIL_BACKEND = os.environ.get(
    "DJANGO_EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)  # switch to 'django.core.mail.backends.smtp.EmailBackend' in production
EMAIL_HOST = os.environ.get("EMAIL_HOST", "mail.yourdomain.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "info@yourdomain.com")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Enquiry form submissions land in this official mail ID's inbox
ENQUIRY_RECEIVER_EMAIL = os.environ.get("ENQUIRY_RECEIVER_EMAIL", EMAIL_HOST_USER)

# -----------------------------------------------------------------------
# BUSINESS DETAILS (placeholders — edit these to your real details;
# used sitewide via core.context_processors.business_info)
# -----------------------------------------------------------------------
GYM_NAME = os.environ.get("GYM_NAME", "Iron Revolution")
GYM_TAGLINE = os.environ.get("GYM_TAGLINE", "The Definitive Standard in Absolute Strength & Athletic Conditioning")
GYM_PHONE = os.environ.get("GYM_PHONE", "+1 (800) 555-IRON")
GYM_WHATSAPP_NUMBER = os.environ.get("GYM_WHATSAPP_NUMBER", "18005554766")  # digits only, country code first
GYM_EMAIL = os.environ.get("GYM_EMAIL", "contact@ironrevolutiongym.com")
GYM_ADDRESS = os.environ.get("GYM_ADDRESS", "420 Olympic Boulevard, Suite 100, Metro Strength District, NY 10001")
GYM_HOURS = os.environ.get("GYM_HOURS", "Mon - Fri: 5:00 AM - 11:00 PM | Sat - Sun: 6:00 AM - 9:00 PM (24/7 Member Access)")

SOCIAL_FACEBOOK = os.environ.get("SOCIAL_FACEBOOK", "#")
SOCIAL_INSTAGRAM = os.environ.get("SOCIAL_INSTAGRAM", "#")
SOCIAL_YOUTUBE = os.environ.get("SOCIAL_YOUTUBE", "#")
SOCIAL_TWITTER = os.environ.get("SOCIAL_TWITTER", "#")

# Google Maps embed URL (no API key needed) — replace with your gym's real
# "Share > Embed a map" src from Google Maps for the Contact page.
GOOGLE_MAP_EMBED_URL = os.environ.get(
    "GOOGLE_MAP_EMBED_URL",
    "https://www.google.com/maps?q=Your+Gym+Location&output=embed",
)

SITE_DOMAIN = os.environ.get("SITE_DOMAIN", "http://127.0.0.1:8000")
