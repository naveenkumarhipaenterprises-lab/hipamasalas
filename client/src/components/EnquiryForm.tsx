import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { products } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";

const businessTypes = ["Retail Customer", "Distributor", "Wholesaler", "Retailer", "Supermarket", "Restaurant", "Restaurant / Hotel", "Exporter", "Other"] as const;
const monthlyVolumes = ["Under 50kg", "50kg – 200kg", "200kg – 500kg", "500kg+", "Not sure yet"] as const;

export function EnquiryForm({ presetProduct, formId = "enquire", variant = "standard" }: { presetProduct?: string; formId?: string; variant?: "standard" | "distributor" }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const createEnquiry = trpc.enquiries.create.useMutation({
    onSuccess: (result) => {
      setStatus("success");
      trackEvent("enquiry_submit", { ownerNotified: result.notified, product: presetProduct || "Not specified" });
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
      businessType: String(values.get("businessType") || "Retail Customer") as (typeof businessTypes)[number],
      expectedMonthlyVolume: String(values.get("expectedMonthlyVolume") || "") as (typeof monthlyVolumes)[number] || undefined,
      productInterest: String(values.get("productInterest") || "All Products"),
      message: String(values.get("message") || "") || undefined,
      consent: true,
    });
  }

  if (status === "success") {
    return <div className="form-success show" role="status"><strong>Thank you.</strong><p>Your enquiry has been received and the HIPA owner has been notified for follow-up.</p></div>;
  }

  return (
    <form id={formId} onSubmit={submit} noValidate>
      <div className="form-row"><div className="form-group"><label>Full Name <span className="req">*</span></label><input name="fullName" required autoComplete="name" data-analytics-field="full_name" /></div><div className="form-group"><label>Mobile Number <span className="req">*</span></label><input name="mobileNumber" required type="tel" autoComplete="tel" data-analytics-field="mobile_number" /></div></div>
      <div className="form-row"><div className="form-group"><label>Email Address</label><input name="emailAddress" type="email" autoComplete="email" data-analytics-field="email_address" /></div><div className="form-group"><label>Business Type</label><select name="businessType" defaultValue={variant === "distributor" ? "Distributor" : "Retail Customer"}>{businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></div></div>
      {variant === "distributor" && <div className="form-row"><div className="form-group"><label>City / Region <span className="req">*</span></label><input name="cityRegion" required autoComplete="address-level2" data-analytics-field="city_region" /></div><div className="form-group"><label>Expected Monthly Volume</label><select name="expectedMonthlyVolume" defaultValue="Not sure yet">{monthlyVolumes.map((volume) => <option key={volume} value={volume}>{volume}</option>)}</select></div></div>}
      <div className="form-group"><label>Product Interested</label><select name="productInterest" defaultValue={presetProduct || "Sambar Powder"}>{products.map((product) => <option key={product.slug} value={product.name}>{product.name}</option>)}<option value="All Products">All Products</option></select></div>
      <div className="form-group"><label>Message</label><textarea name="message" rows={5} placeholder="Tell us a little about your enquiry..." data-analytics-field="enquiry_message" /></div>
      <label className="newsletter-inline-note"><input name="consent" type="checkbox" required /> I agree that HIPA Masalas may use these details to respond to this enquiry.</label>
      {status === "error" && <p className="form-error show" role="alert">Your enquiry could not be submitted. Please try again or contact HIPA by phone or WhatsApp.</p>}
      <button className="btn btn-primary btn-block form-submit" type="submit" disabled={createEnquiry.isPending} data-analytics-event="enquiry_submit">
        {createEnquiry.isPending ? <><LoaderCircle className="spin" size={18} /> Sending enquiry</> : "Submit enquiry"}
      </button>
    </form>
  );
}
