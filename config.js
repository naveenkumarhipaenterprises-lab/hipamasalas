/* =========================================================
   HIPA MASALA — SITE CONFIGURATION
   ---------------------------------------------------------
   Single source of truth for contact details, social links,
   map embed and EmailJS credentials.

   Update the values below and every page (top info bar,
   floating WhatsApp/Call buttons, footer, contact page,
   contact form) will update automatically.
   ========================================================= */

window.SITE_CONFIG = {

  /* ---------- Contact details ---------- */
  // Used for the floating call button and the top info bar.
  // Format: full number with country code, no spaces, for the tel: link.
  PHONE_DISPLAY: "+91 70580 53055",
  PHONE_TEL: "+917058053055",

  // WhatsApp number, digits only, with country code (no + or spaces).
  WHATSAPP_NUMBER: "917058053055",
  WHATSAPP_DEFAULT_MESSAGE: "Hi HIPA Masala, I'd like to know more about your products.",

  EMAIL_ADDRESS: "info@hipamasalas.com",

  ADDRESS_LINE_1: "REPLACE_WITH_FULL_ADDRESS",
  ADDRESS_LINE_2: "Pallavaram, Chennai, Tamil Nadu, India",

  BUSINESS_HOURS_WEEKDAY: "Monday – Saturday: 9:00 AM – 7:00 PM",
  BUSINESS_HOURS_WEEKEND: "Sunday: Closed",

  /* ---------- Social links (placeholders — replace with real profile URLs) ---------- */
  SOCIAL_LINKS: {
    facebook: "https://www.facebook.com/profile.php?id=61592093192345",
    instagram: "https://www.instagram.com/hipa_masala/",
    linkedin: "https://www.linkedin.com/company/REPLACE_WITH_LINKEDIN_HANDLE",
    youtube: "https://www.youtube.com/@REPLACE_WITH_YOUTUBE_HANDLE"
  },

  /* ---------- Google Maps ----------
     Replace with the real embed URL from Google Maps:
     Share -> Embed a map -> copy the src of the <iframe>          */
  MAPS_EMBED_URL: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d80.1548!3d12.9675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPallavaram%2C+Chennai%2C+Tamil+Nadu!5e0!3m2!1sen!2sin!4v0000000000000",

  /* ---------- EmailJS (do NOT wire up yet — placeholders only) ---------- */
  EMAILJS: {
    SERVICE_ID: "service_r4j4199",
    TEMPLATE_ID: "template_zzox0g7",
    PUBLIC_KEY: "_h2SZ5lHGo7fotRew"
  }

};
