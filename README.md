# Gym Website — Django + Tailwind-ready build

This rebuilds the original `gym2-master` HTML template as a Django project.
**The visual design is unchanged** — every CSS/JS/font/image file from the
original template was copied as-is into Django's `static/` folder, and each
page's markup was carried over verbatim into Django templates (only asset
paths were switched to `{% static %}` and nav links to `{% url %}`).

No React is used anywhere. Tailwind CSS was not required to build the pages
because the original template's Bootstrap-based CSS already implements the
full design — adding Tailwind on top would fight the existing stylesheet and
risk changing the look. If you later want a hand-built section (e.g. a new
CTA block not present in the original design), you can safely load Tailwind
via CDN for that one component without touching the existing CSS.

## What's included (matches the deliverables list only)

| Deliverable | Where it lives |
|---|---|
| 5 pages | `core/templates` → Home, About, Services, Gallery, Contact |
| Enquiry Form | Contact page (`core/forms.py` `EnquiryForm`, saved via `core/models.py` `Enquiry`) |
| Google Map Integration | `contact.html` iframe, URL set by `GOOGLE_MAP_EMBED_URL` |
| WhatsApp Chat Button | Floating button in `templates/core/base.html`, all pages |
| CTAs (Enquire Now / Contact Us / Get Started) | Reused the template's own buttons, pointed at the Contact page |
| Social Media Integration | Footer icons in `base.html`, links from settings |
| Mobile Responsive | Inherited from the original Bootstrap grid — untouched |
| SEO Friendly | Per-page `<title>`/meta description blocks, `sitemap.xml`, `robots.txt` |
| SSL Certificate | Applied at hosting level (see below) |
| 1 Year Hosting / 1 Official Mail ID | Configure via `.env` — see below |

## Setup

```bash
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install -r requirements.txt

cp .env.example .env             # then edit .env with your real details

python manage.py migrate
python manage.py createsuperuser   # to view enquiries in /admin/
python manage.py runserver
```

Visit `http://127.0.0.1:8000/`.

## Filling in your real business details

Everything business-specific (name, phone, WhatsApp number, address, email,
social links, Google Maps embed URL) is a setting, not hard-coded in any
template — edit `.env` (see `.env.example`) and every page updates
automatically via `core/context_processors.py`.

## Enquiry Form → email

Enquiry submissions are saved to the database (visible at `/admin/`) **and**
emailed to `ENQUIRY_RECEIVER_EMAIL` (your 1 official mail ID). Set
`DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` and the
`EMAIL_*` values in `.env` to your hosting provider's SMTP details to make
this live; until then it defaults to printing emails to the console for
local testing.

## Deploying (1-year hosting + SSL)

1. Set `DJANGO_DEBUG=False` and `DJANGO_ALLOWED_HOSTS=yourdomain.com` in `.env`.
2. Run `python manage.py collectstatic`.
3. Point your host's WSGI config at `iron_revolution.wsgi.application`.
4. Enable SSL/HTTPS via your host's free Let's Encrypt option (most cPanel /
   shared hosts provide "AutoSSL").
5. Point your domain's MX/mail settings at the 1 official mail ID your host
   provisions, and put those SMTP credentials in `.env`.

## Project structure

```
iron_revolution/  Django project settings/urls
core/             the single app: models, views, forms, admin, sitemap
templates/core/   base.html + home/about/services/gallery/contact.html
static/           original template's css/js/fonts/img (untouched)
```
