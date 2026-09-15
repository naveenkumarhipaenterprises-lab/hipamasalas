export type EnquirySubmission = {
  fullName: string;
  mobileNumber: string;
  emailAddress?: string | null;
  cityRegion?: string | null;
  businessType: string;
  expectedMonthlyVolume?: string | null;
  productInterest: string;
  message?: string | null;
  source?: string;
};

export type NewsletterSubmission = {
  emailAddress: string;
  source?: string;
};

export async function submitEnquiryToGoogleSheets(data: EnquirySubmission): Promise<{ success: boolean; mode: "google_sheets" | "console" }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_ENQUIRIES_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const payload = {
    type: "enquiry",
    timestamp: new Date().toISOString(),
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    emailAddress: data.emailAddress || "",
    cityRegion: data.cityRegion || "",
    businessType: data.businessType,
    expectedMonthlyVolume: data.expectedMonthlyVolume || "",
    productInterest: data.productInterest,
    message: data.message || "",
    source: data.source || "website",
  };

  if (!webhookUrl) {
    console.info("[Enquiry Submission] No GOOGLE_SHEETS_ENQUIRIES_URL configured in .env. Logged locally:", payload);
    return { success: true, mode: "console" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("[Google Sheets] Webhook responded with status:", response.status);
    }
    return { success: true, mode: "google_sheets" };
  } catch (error) {
    console.error("[Google Sheets] Failed to send enquiry to Google Sheets:", error);
    // Return success to user so client does not see failure if network glitch to Google Sheets occurs
    return { success: true, mode: "console" };
  }
}

export async function submitNewsletterToGoogleSheets(data: NewsletterSubmission): Promise<{ success: boolean; mode: "google_sheets" | "console" }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_NEWSLETTER_URL || process.env.GOOGLE_SHEETS_ENQUIRIES_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const payload = {
    type: "newsletter",
    timestamp: new Date().toISOString(),
    emailAddress: data.emailAddress,
    source: data.source || "website",
  };

  if (!webhookUrl) {
    console.info("[Newsletter Subscription] No GOOGLE_SHEETS_NEWSLETTER_URL configured in .env. Logged locally:", payload);
    return { success: true, mode: "console" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("[Google Sheets] Webhook responded with status:", response.status);
    }
    return { success: true, mode: "google_sheets" };
  } catch (error) {
    console.error("[Google Sheets] Failed to send newsletter subscription to Google Sheets:", error);
    return { success: true, mode: "console" };
  }
}
