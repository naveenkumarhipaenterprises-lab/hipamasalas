/* =========================================================
   HIPA MASALA — CONTACT FORM
   ---------------------------------------------------------
   Vanilla JS validation for contact.html.
   The form is structured and ready for EmailJS — see the
   commented block at the bottom for how to wire it up once
   config.js EMAILJS values are filled in. EmailJS is NOT
   integrated yet, per project instructions.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('.form-submit');

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

    if (!validateForm()) {
      const firstInvalid = form.querySelector('.field-error.show');
      if (firstInvalid) {
        const input = firstInvalid.previousElementSibling;
        if (input && input.focus) input.focus();
      }
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    /* -----------------------------------------------------
       EmailJS integration point (currently disabled).
       Once config.js EMAILJS values are filled in and the
       EmailJS SDK script tag is added to contact.html, this
       block can be uncommented to send the form.

    emailjs.send(
      window.SITE_CONFIG.EMAILJS.SERVICE_ID,
      window.SITE_CONFIG.EMAILJS.TEMPLATE_ID,
      {
        full_name: fields.fullName.el.value,
        mobile_number: fields.mobileNumber.el.value,
        email_address: fields.emailAddress.el.value,
        business_type: document.getElementById('businessType').value,
        product_interested: document.getElementById('productInterested').value,
        message: document.getElementById('message').value
      },
      window.SITE_CONFIG.EMAILJS.PUBLIC_KEY
    ).then(() => {
      // success UI (see below)
    }).catch(() => {
      // error UI
    });

    ----------------------------------------------------- */

    // Front-end only demo behaviour until EmailJS is wired up.
    setTimeout(() => {
      successBox.classList.add('show');
      form.reset();
      Object.values(fields).forEach(field => {
        if (field.el) field.el.removeAttribute('data-touched');
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });

});
