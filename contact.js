/* =========================================================
   HIPA MASALA — CONTACT FORM
   ---------------------------------------------------------
   Vanilla JS validation + EmailJS submission for contact.html.
   Success is only shown when EmailJS actually confirms the
   send; failures show an inline error and never silently
   pass. Mirrors the distributor form pattern in products.js.
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
      // Optional field — only validated if the person enters something.
      validate: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    }
  };

  const showError = (field, show) => {
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

    if (isSubmitting) return; // Prevent duplicate submissions (double-click / double-tap)

    if (!validateForm()) {
      const firstInvalid = form.querySelector('.field-error.show');
      if (firstInvalid) {
        const input = firstInvalid.previousElementSibling;
        if (input && input.focus) input.focus();
      }
      return;
    }

    if (!window.emailjs || !cfg.EMAILJS) {
      if (errorBox) {
        errorBox.classList.add('show');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    isSubmitting = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (successBox) successBox.classList.remove('show');
    if (errorBox) errorBox.classList.remove('show');

    emailjs.send(
      cfg.EMAILJS.SERVICE_ID,
      cfg.EMAILJS.TEMPLATE_ID,
      {
        full_name: fields.fullName.el.value,
        mobile_number: fields.mobileNumber.el.value,
        email_address: fields.emailAddress.el.value,
        business_type: document.getElementById('businessType').value,
        product_interested: document.getElementById('productInterested').value,
        message: document.getElementById('message').value
      },
      cfg.EMAILJS.PUBLIC_KEY
    ).then(() => {
      // Only shown when EmailJS actually confirms the send.
      successBox.classList.add('show');
      form.reset();
      Object.values(fields).forEach(field => {
        if (field.el) field.el.removeAttribute('data-touched');
      });
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(() => {
      // EmailJS failed — show the error state, never the success state.
      if (errorBox) {
        errorBox.classList.add('show');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }).finally(() => {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
  });

});
