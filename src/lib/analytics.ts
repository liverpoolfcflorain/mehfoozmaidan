// Google Analytics visitor tracking (gtag.js). Browser-only.
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

export function initAnalytics() {
  if (started || typeof window === "undefined") return;
  const id = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as string | undefined;
  if (!id) {
    console.warn("Google Analytics measurement ID is not configured.");
    return;
  }
  started = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag.js needs the Arguments object
    window.dataLayer.push(arguments);
  };
  window.gtag("set", "developer_id.dZjgwMW", true);
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });

  let last = "";
  const track = () => {
    const path = location.pathname + location.search;
    if (path === last) return;
    last = path;
    window.gtag?.("event", "page_view", { page_path: path, page_location: location.href, page_title: document.title });
  };
  // The app changes pages with history.pushState, so watch it directly.
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method].bind(history);
    history[method] = (...args: Parameters<History["pushState"]>) => {
      original(...args);
      setTimeout(track, 0);
    };
  }
  window.addEventListener("popstate", () => setTimeout(track, 0));
  track();
}
