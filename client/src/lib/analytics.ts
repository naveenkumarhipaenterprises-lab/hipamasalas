export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.umami?.track?.(eventName, data);
  window.dispatchEvent(new CustomEvent("hipa:conversion", { detail: { eventName, data } }));
}
