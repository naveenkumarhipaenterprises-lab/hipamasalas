import { describe, expect, it } from "vitest";
import { submitEnquiryToGoogleSheets, submitNewsletterToGoogleSheets } from "./googleSheets";
import { listPublishedBlogPosts, getPublishedBlogPostBySlug, listProductAvailability } from "./db";

describe("zero-database integrations", () => {
  it("handles enquiry submission gracefully in local/console mode without crashing", async () => {
    const result = await submitEnquiryToGoogleSheets({
      fullName: "Test Customer",
      mobileNumber: "9876543210",
      emailAddress: "test@example.com",
      businessType: "Distributor",
      productInterest: "Sambar Powder",
      message: "Looking for 100kg monthly supply",
    });

    expect(result.success).toBe(true);
    expect(["console", "google_sheets"]).toContain(result.mode);
  });

  it("handles newsletter subscription gracefully in local/console mode without crashing", async () => {
    const result = await submitNewsletterToGoogleSheets({
      emailAddress: "subscriber@example.com",
    });

    expect(result.success).toBe(true);
    expect(["console", "google_sheets"]).toContain(result.mode);
  });

  it("loads all 8 core product availability items without MySQL", async () => {
    const availability = await listProductAvailability();
    expect(availability.length).toBeGreaterThanOrEqual(8);
  });

  it("loads published blogs seamlessly without MySQL", async () => {
    const blogs = await listPublishedBlogPosts();
    expect(blogs.length).toBeGreaterThanOrEqual(1);
    const firstSlug = blogs[0].slug;
    const single = await getPublishedBlogPostBySlug(firstSlug);
    expect(single).toBeDefined();
    expect(single?.slug).toBe(firstSlug);
  });
});
