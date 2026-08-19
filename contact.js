/* =========================================================
   HIPA MASALA — CONTACT & B2B ENQUIRY FORM
   =========================================================
   Validates inputs, saves to API (/api/enquiries), logs lead
   to Admin Dashboard, and dispatches email via EmailJS/Resend.
   ========================================================= */

'use strict';

if (window.emailjs && window.SITE_CONFIG && window.SITE_CONFIG.EMAILJS) {
  emailjs.init(window.SITE_CONFIG.EMAILJS.PUBLIC_KEY);
}

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const cfg = window.SITE_CONFIG || {};
  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  const submitBtn = form.querySelector('.form-submit');
  let isSubmitting = false;

  const fields = {
    fullName: {
      el: document.getElementById('fullName'),
      errorEl: document.getElementById('fullNameError'),
      validate: (v) => v.trim().length >= 2
    },
    mobileNumber: {
      el: document.getElementById('mobileNumber'),
      errorEl: document.getElementById('mobileNumberError'),
      validate: (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim())
    },
    emailAddress: {
      el: document.getElementById('emailAddress'),
      errorEl: document.getElementById('emailAddressError'),
      validate: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    }
  };

  const showError = (field, show) => {
    if (!field.el) return;
    field.el.setAttribute('data-touched', 'true');
    if (field.errorEl) field.errorEl.classList.toggle('show', show);
  };

  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => {
      showError(field, !field.validate(field.el.value));
    });
    field.el.addEventListener('input', () => {
      if (field.el.getAttribute('data-touched') === 'true') {
        showError(field, !field.validate(field.el.value));
      }
    });
  });

  const validateForm = () => {
    let isValid = true;
    Object.values(fields).forEach(field => {
      if (!field.el) return;
      const fieldValid = field.validate(field.el.value);
      showError(field, !fieldValid);
      if (!fieldValid) isValid = false;
    });
    return isValid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      const firstInvalid = form.querySelector('.field-error.show');
      if (firstInvalid) {
        const input = firstInvalid.previousElementSibling;
        if (input && input.focus) input.focus();
      }
      return;
    }

    isSubmitting = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Enquiry...';
    if (successBox) successBox.classList.remove('show');
    if (errorBox) errorBox.classList.remove('show');

    const enquiryPayload = {
      name: fields.fullName.el.value.trim(),
      phone: fields.mobileNumber.el.value.trim(),
      email: fields.emailAddress.el.value.trim() || 'not-provided@hipamasalas.com',
      company_name: (document.getElementById('businessType') ? document.getElementById('businessType').value : ''),
      product_name_snapshot: (document.getElementById('productInterested') ? document.getElementById('productInterested').value : 'General Masala Enquiry'),
      message: (document.getElementById('message') ? document.getElementById('message').value.trim() : ''),
      created_at: new Date().toISOString(),
      status: 'new'
    };

    // Save lead to localStorage for local/Admin CMS visibility
    try {
      const currentEnquiries = JSON.parse(localStorage.getItem('hipa_enquiries') || '[]');
      currentEnquiries.unshift(enquiryPayload);
      localStorage.setItem('hipa_enquiries', JSON.stringify(currentEnquiries));
    } catch (err) {}

    // Save lead to /api/enquiries & Supabase DB
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryPayload)
    }).catch(() => {});

    // Optional EmailJS dispatch
    if (window.emailjs && cfg.EMAILJS && cfg.EMAILJS.SERVICE_ID) {
      emailjs.send(
        cfg.EMAILJS.SERVICE_ID,
        cfg.EMAILJS.TEMPLATE_ID,
        {
          full_name: enquiryPayload.name,
          mobile_number: enquiryPayload.phone,
          email_address: enquiryPayload.email,
          business_type: enquiryPayload.company_name,
          product_interested: enquiryPayload.product_name_snapshot,
          message: enquiryPayload.message
        },
        cfg.EMAILJS.PUBLIC_KEY
      ).catch(() => {});
    }

    // Display clean success state
    setTimeout(() => {
      if (successBox) successBox.classList.add('show');
      form.reset();
      Object.values(fields).forEach(field => {
        if (field.el) field.el.removeAttribute('data-touched');
      });
      if (successBox) successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 600);
  });

});
