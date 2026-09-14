from django import forms

from core.models import Enquiry


class EnquiryForm(forms.ModelForm):
    """Clean, accessible ModelForm for visitor enquiry and assessment requests."""

    class Meta:
        model = Enquiry
        fields = ["name", "phone", "email", "service", "message"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "placeholder": "Your Full Name (e.g. Marcus Vance)",
                    "autocomplete": "name",
                }
            ),
            "phone": forms.TextInput(
                attrs={
                    "placeholder": "Direct Contact / WhatsApp (e.g. +1 555-019-4766)",
                    "autocomplete": "tel",
                }
            ),
            "email": forms.EmailInput(
                attrs={
                    "placeholder": "Official Email (e.g. marcus@example.com)",
                    "autocomplete": "email",
                }
            ),
            "service": forms.Select(),
            "message": forms.Textarea(
                attrs={
                    "rows": 5,
                    "placeholder": (
                        "Describe your requirements (e.g. target goals, powerlifting PR targets, "
                        "preferred training hours, InBody scan request, or supplement preorder)..."
                    ),
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Apply standard luxury dark-theme input styling across all form fields
        for field in self.fields.values():
            css_classes = ["form-control", "ir_form_input"]

            if isinstance(field.widget, forms.Select):
                css_classes.append("ir_form_select")
            elif isinstance(field.widget, forms.Textarea):
                css_classes.append("ir_form_textarea")

            field.widget.attrs["class"] = " ".join(css_classes)

        # Message is required for athlete requirements
        self.fields["message"].required = True
