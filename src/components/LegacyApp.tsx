import { useEffect } from "react";

// The Mehfooz Maidan interface is the original browser app (src/legacy/app.js).
// It renders into #app and manages its own in-page navigation.
export function LegacyApp() {
  useEffect(() => {
    void import("@/legacy/app.js");
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="app" aria-live="polite" />
      <div id="toast" className="toast" role="status" aria-live="assertive" />
    </>
  );
}
