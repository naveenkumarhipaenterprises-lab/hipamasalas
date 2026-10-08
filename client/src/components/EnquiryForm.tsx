import { FormEvent, useId, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { products } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";

const businessTypes = [
  "Retail Customer",
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Supermarket",
  "Restaurant",
  "Restaurant / Hotel",
  "Exporter",
  "Other",
] as const;

const monthlyVolumes = [
  "Under 50kg",
  "50kg – 200kg",
  "200kg – 500kg",
  "500kg+",
  "Not sure yet",
] as const;

export function EnquiryForm({
  presetProduct,
  formId = "enquire",
  variant = "standard",
}: {
  presetProduct?: string;
  formId?: string;
  variant?: "standard" | "distributor";
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const createEnquiry = trpc.enquiries.create.useMutation({
    onSuccess: (result) => {
      setStatus("success");
      trackEvent("enquiry_submit", {
        ownerNotified: result.notified,
        product: presetProduct || "Not specified",
      });
    },
    onError: () => setStatus("error"),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (values.get("consent") !== "on") return;
    setStatus("idle");
    createEnquiry.mutate({
      fullName: String(values.get("fullName") || ""),
      mobileNumber: String(values.get("mobileNumber") || ""),
      emailAddress: String(values.get("emailAddress") || "") || undefined,
      cityRegion: String(values.get("cityRegion") || "") || undefined,
      businessType: String(
        values.get("businessType") || "Retail Customer"
      ) as (typeof businessTypes)[number],
      expectedMonthlyVolume:
        (String(values.get("expectedMonthlyVolume") || "") as (typeof monthlyVolumes)[number]) ||
        undefined,
      productInterest: String(values.get("productInterest") || "All Products"),
      message: String(values.get("message") || "") || undefined,
      consent: true,
    });
  }

  if (status === "success") {
    return (
      <div className="form-success show" role="status">
        <strong>Thank you!</strong>
        <p>Your enquiry has been received. Our team in Chennai will get in touch with you promptly.</p>
      </div>
    );
  }

  return (
    <form id={formId} className="hipa-enquiry-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={fieldId("fullName")}>
            Full Name <span className="req">*</span>
          </label>
          <input
            id={fieldId("fullName")}
            name="fullName"
            required
            autoComplete="name"
            placeholder="Enter your name"
            data-analytics-field="full_name"
          />
        </div>
        <div className="form-group">
          <label htmlFor={fieldId("mobileNumber")}>
            Mobile Number <span className="req">*</span>
          </label>
          <input
            id={fieldId("mobileNumber")}
            name="mobileNumber"
            required
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            data-analytics-field="mobile_number"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={fieldId("emailAddress")}>Email Address</label>
          <input
            id={fieldId("emailAddress")}
            name="emailAddress"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            data-analytics-field="email_address"
          />
        </div>
        <div className="form-group">
          <label htmlFor={fieldId("businessType")}>Business Type</label>
          <select
            id={fieldId("businessType")}
            name="businessType"
            defaultValue={variant === "distributor" ? "Distributor" : "Retail Customer"}
          >
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {variant === "distributor" && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={fieldId("cityRegion")}>
              City / Region <span className="req">*</span>
            </label>
            <input
              id={fieldId("cityRegion")}
              name="cityRegion"
              required
              autoComplete="address-level2"
              placeholder="e.g. Chennai, Coimbatore, Madurai"
              data-analytics-field="city_region"
            />
          </div>
          <div className="form-group">
            <label htmlFor={fieldId("expectedMonthlyVolume")}>Expected Monthly Volume</label>
            <select
              id={fieldId("expectedMonthlyVolume")}
              name="expectedMonthlyVolume"
              defaultValue="Not sure yet"
            >
              {monthlyVolumes.map((volume) => (
                <option key={volume} value={volume}>
                  {volume}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor={fieldId("productInterest")}>Product Interested</label>
        <select
          id={fieldId("productInterest")}
          name="productInterest"
          defaultValue={presetProduct || "Sambar Powder"}
        >
          {products.map((product) => (
            <option key={product.slug} value={product.name}>
              {product.name}
            </option>
          ))}
          <option value="All Products">All Products (Full Range)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={fieldId("message")}>Message</label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          placeholder="Tell us about your requirement or trade query..."
          data-analytics-field="enquiry_message"
        />
      </div>

      <label className="form-consent-label">
        <input name="consent" type="checkbox" required defaultChecked />
        <span>I agree that HIPA Masala / HIPA Enterprises may use these details to respond to this business enquiry.</span>
      </label>

      {status === "error" && (
        <p className="form-error show" role="alert">
          Your enquiry could not be submitted. Please try again or contact HIPA directly by phone (+91 70580 53055) or WhatsApp.
        </p>
      )}

      <button
        className="btn btn-primary btn-block form-submit"
        type="submit"
        disabled={createEnquiry.isPending}
        data-analytics-event="enquiry_submit"
      >
        {createEnquiry.isPending ? (
          <>
            <LoaderCircle className="spin" size={18} /> Sending Enquiry...
          </>
        ) : (
          "Submit Business Enquiry"
        )}
      </button>
    </form>
  );
}
