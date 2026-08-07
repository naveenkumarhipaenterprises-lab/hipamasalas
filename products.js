/* =========================================================
   HIPA MASALA — PRODUCTS LANDING PAGE
   ---------------------------------------------------------
   Page-specific behaviour for products.html only:
     1. Category filter tabs (All / Powders)
     2. FAQ accordion
     3. Per-product & generic WhatsApp deep links (uses config.js)
     4. "Enquire Now" -> scrolls to distributor form & pre-fills it
     5. Distributor form validation (mirrors contact.js pattern)

   Shared behaviour (header, mobile nav, scroll reveal, back-to-top,
   footer year, top-bar/floating-button config) already lives in
   script.js and is reused as-is — nothing is duplicated here.
   ========================================================= */

'use strict';

if (window.emailjs && window.SITE_CONFIG && window.SITE_CONFIG.EMAILJS) {
  emailjs.init(window.SITE_CONFIG.EMAILJS.PUBLIC_KEY);
}

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};

  /* ---------- WhatsApp link builder (product-specific message) ---------- */
  const buildWaHref = (message) => {
    const number = cfg.WHATSAPP_NUMBER || '917058053055';
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  document.querySelectorAll('.whatsapp-product-btn').forEach(btn => {
    const product = btn.getAttribute('data-product') || '';
    btn.href = buildWaHref(`Hi HIPA Masala, I'd like to enquire about ${product}. Please share pricing and availability.`);
  });

  document.querySelectorAll('.whatsapp-generic-btn').forEach(btn => {
    const message = btn.getAttribute('data-message') || (cfg.WHATSAPP_DEFAULT_MESSAGE || '');
    btn.href = buildWaHref(message);
  });

  /* ---------- Category filter tabs ---------- */
  const tabs = document.querySelectorAll('.category-tab');
  const cards = document.querySelectorAll('.pdp-card');
  const emptyState = document.getElementById('pdpEmptyState');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      let visibleCount = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others (single-open accordion)
      faqItems.forEach(other => {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- "Enquire Now" -> scroll to distributor form + pre-fill ---------- */
  const productSelect = document.getElementById('distProductInterested');
  const distMessage = document.getElementById('distMessage');
  const distFullName = document.getElementById('distFullName');
  const distributorSection = document.getElementById('distributor');

  document.querySelectorAll('.enquire-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product') || '';

      if (productSelect) {
        const optionExists = Array.from(productSelect.options).some(opt => opt.value === productName);
        if (optionExists) {
          productSelect.value = productName;
        } else if (distMessage) {
          distMessage.value = `I'm interested in: ${productName}`;
        }
      }

      if (distributorSection) {
        distributorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (distFullName) {
        setTimeout(() => distFullName.focus(), 500);
      }
    });
  });

  /* ---------- Distributor form validation (mirrors contact.js) ---------- */
  const form = document.getElementById('distributorForm');
  if (!form) return;

  const successBox = document.getElementById('distributorFormSuccess');
  const errorBox = document.getElementById('distributorFormError');
  const submitBtn = form.querySelector('.form-submit');
  let isSubmitting = false;

  const fields = {
    fullName: {
      el: document.getElementById('distFullName'),
      errorEl: document.getElementById('distFullNameError'),
      validate: (v) => v.trim().length >= 2
    },
    mobileNumber: {
      el: document.getElementById('distMobileNumber'),
      errorEl: document.getElementById('distMobileNumberError'),
      validate: (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim())
    },
    emailAddress: {
      el: document.getElementById('distEmailAddress'),
      errorEl: document.getElementById('distEmailAddressError'),
      validate: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    },
    city: {
      el: document.getElementById('distCity'),
      errorEl: document.getElementById('distCityError'),
      validate: (v) => v.trim().length >= 2
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

    // EmailJS integration — reuses the exact same service/template/public
    // key as the Contact form (contact.js), so no new EmailJS account or
    // configuration is needed. See config.js for the shared credentials.
    emailjs.send(
      cfg.EMAILJS.SERVICE_ID,
      cfg.EMAILJS.TEMPLATE_ID,
      {
        full_name: fields.fullName.el.value,
        mobile_number: fields.mobileNumber.el.value,
        email_address: fields.emailAddress.el.value,
        city: fields.city.el.value,
        business_type: document.getElementById('distBusinessType').value,
        monthly_volume: document.getElementById('distMonthlyVolume').value,
        product_interested: document.getElementById('distProductInterested').value,
        message: distMessage ? distMessage.value : '',
        form_type: 'Distributor / Bulk Order Enquiry'
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
