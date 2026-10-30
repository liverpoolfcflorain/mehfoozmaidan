const roles = {
  athlete: "Athlete",
  sports: "Sports professional or organisation",
  lawyer: "Lawyer",
  admin: "Administrator",
};

const navigation = [
  ["/mission", "Mission"],
  ["/how-it-works", "How it works"],
  ["/opportunities", "Opportunities"],
  ["/athlete-rights", "Athlete rights"],
  ["/legal-support", "Legal support"],
  ["/stories", "Stories"],
  ["/blog", "Blog"],
];

const portalLinks = {
  athlete: [
    ["", "Overview"], ["profile", "Profile & portfolio"], ["opportunities", "Discover opportunities"],
    ["applications", "Applications & invitations"], ["network", "Connections & saved"], ["messages", "Messages"],
    ["legal", "Legal assistance"], ["contracts", "Contract Studio"], ["assistant", "AI Assistant"],
    ["suggestions", "Suggestions"], ["notifications", "Notifications"], ["settings", "Settings"],
  ],
  sports: [
    ["", "Overview"], ["profile", "Profile & verification"], ["discover", "Athlete discovery"],
    ["opportunities", "Opportunities & recruitment"], ["network", "Connections & shortlist"], ["messages", "Messages"],
    ["legal", "Legal support"], ["contracts", "Contract Studio"], ["assistant", "AI Assistant"],
    ["notifications", "Notifications"], ["settings", "Settings"],
  ],
  lawyer: [
    ["", "Overview"], ["profile", "Profile & credentials"], ["requests", "Incoming requests"],
    ["matters", "Assigned matters"], ["contracts", "Contract review queue"], ["network", "Connections"],
    ["messages", "Case & general messages"], ["assistant", "AI Assistant"], ["notifications", "Notifications"], ["settings", "Settings"],
  ],
  admin: [
    ["", "Analytics"], ["verification", "Verification"], ["athletes", "Athletes"], ["sports", "Sports & organisations"],
    ["lawyers", "Lawyers"], ["reports", "Reports & safeguarding"], ["suggestions", "Suggestions"], ["content", "Content & blog"],
    ["media", "Media & mission video"], ["audit", "Audit log"],
  ],
};

const profileTables = { athlete: "athlete_profiles", sports: "sports_profiles", lawyer: "lawyer_profiles" };
const opportunityTypes = ["trial", "recruitment", "scholarship", "coaching", "tournament", "sponsorship", "camp", "other"];
const agreementTypes = [
  "Athlete–club agreement", "Sponsorship / endorsement", "Coaching agreement", "Agent / representation",
  "Image rights licence", "Scholarship / academy agreement", "Other",
];
const publicPages = {
  "/about": {
    eyebrow: "About", title: "A serious institution for sport.",
    intro: "Mehfooz Maidan — “protected ground” — is a Pakistan-focused platform for sporting opportunity, professional networking and legal access.",
    sections: [
      { h: "What we are", p: ["One accountable ecosystem where athletes, sports professionals and lawyers interact through verified profiles and clear permissions."] },
      { h: "What we are not", p: ["Not a news site, a law-firm directory or a chatbot. We do not guarantee selection, legal outcomes or the legitimacy of unverified information."] },
    ],
  },
  "/mission": {
    eyebrow: "Mission & vision", title: "Every athlete deserves protected ground.",
    intro: "Mehfooz Maidan exists to make sporting opportunity easier to discover, professional relationships more transparent, and legal help more accessible across Pakistan.",
    image: "runner",
    sections: [
      { h: "The problems we address", p: ["Access to opportunity: talented athletes often lack a credible way to show their ability to coaches, scouts, academies and boards.", "Legal protection: athletes and organisations sign agreements, sponsorships and payment arrangements without accessible advice.", "Trust: recruitment, credentials and contracts need verification, privacy and safeguards."] },
      { h: "Who we serve", p: ["Athletes at every level, sports professionals and organisations — coaches, scouts, clubs, academies, federations, schools and universities — and lawyers who want to support sport."] },
      { h: "How the three groups work together", p: ["Athletes connect with boards and coaches for discovery and development. Athletes and organisations connect with lawyers for questions, drafting and review. Every interaction respects each person's permissions and privacy settings."] },
      { h: "Our approach", p: ["We verify what we can and say clearly what verification does not guarantee. We never promise selection, legal outcomes or contract enforceability. AI tools help people prepare — qualified lawyers advise."] },
      { h: "Privacy & safeguarding", p: ["We collect only what is necessary, keep sensitive documents private, and apply guardian consent and extra protection for minors."] },
    ],
  },
  "/contact": {
    eyebrow: "Contact & safeguarding", title: "We're listening.",
    intro: "For safeguarding concerns involving a minor or immediate danger, contact local emergency services first.",
    sections: [
      { h: "Safeguarding", p: ["Signed-in users can report or block any account from its profile or conversation. Safeguarding reports are escalated to our moderation team."] },
      { h: "General enquiries", p: ["A secure contact form will be available here once accounts launch."] },
    ],
  },
  "/athlete-rights": {
    eyebrow: "Athlete rights", title: "Know before you sign.",
    intro: "General educational information. It is not legal advice — for your situation, speak to a verified lawyer.",
    sections: [
      { h: "Read every agreement", p: ["You can ask for time to read a contract and to have it reviewed. Make sure duration, payment, termination and obligations are written clearly."] },
      { h: "Payments & prize money", p: ["Ask how and when you will be paid, what deductions apply, and what happens if payment is late. Keep written records."] },
      { h: "Your image and name", p: ["Media and sponsorship agreements may let others use your image. Understand where, for how long and whether you are compensated."] },
      { h: "Minors & guardians", p: ["Athletes under 18 should involve a parent or guardian in any agreement. Mehfooz Maidan applies guardian consent and extra safeguards for minors."] },
      { h: "Jurisdiction & review", p: ["Resources here concern Pakistan. Curated references with review dates will be added by our legal team; where none are listed, we say so rather than guess."] },
    ],
  },
  "/legal-support": {
    eyebrow: "Legal support", title: "Lawyers who understand sport.",
    intro: "Athletes, coaches and organisations can request legal assistance from verified lawyers.",
    sections: [
      { h: "Request assistance", p: ["Describe your issue, jurisdiction, deadline and preferred language. Eligible lawyers are notified without unnecessary personal detail."] },
      { h: "Protected workspaces", p: ["When a lawyer accepts, a private workspace holds messages, documents, drafts, comments and deadlines — visible only to participants."] },
      { h: "Contract Studio", p: ["Draft club, academy, coaching, sponsorship, representation, image-rights and prize-money agreements with AI assistance, then request real lawyer review. Every AI draft remains a draft."] },
      { h: "What this is not", p: ["Submitting a request does not by itself create a lawyer–client relationship, and no outcome is guaranteed."] },
    ],
  },
  "/privacy": {
    eyebrow: "Privacy", title: "Privacy policy.",
    intro: "Draft policy — to be reviewed by counsel before launch.",
    sections: [
      { h: "What we collect", p: ["Only information needed to run the platform: account details, profile content you choose to add, and verification documents you submit."] },
      { h: "How we protect it", p: ["Identity documents, credentials, contracts and evidence are kept in private storage with strict access controls."] },
      { h: "Your controls", p: ["You control profile visibility and contact preferences, and can request export or deletion of your account."] },
      { h: "AI processing", p: ["We avoid sending confidential documents or sensitive personal data to AI providers unnecessarily and tell you when AI is used."] },
    ],
  },
  "/terms": {
    eyebrow: "Terms", title: "Terms of use.",
    intro: "Draft terms — to be reviewed by counsel before launch.",
    sections: [
      { h: "Accounts", p: ["Provide accurate information, keep your credentials secure and use only the role you are entitled to."] },
      { h: "Conduct", p: ["No harassment, impersonation, fraud or exploitation. We may suspend accounts that breach these terms."] },
      { h: "No guarantees", p: ["We do not guarantee selection, legal outcomes or contract enforceability."] },
    ],
  },
  "/disclaimer": {
    eyebrow: "Disclaimer", title: "Legal disclaimer.",
    sections: [
      { h: "Not legal advice", p: ["General information, resources and AI-generated content on this platform are not personalised legal advice."] },
      { h: "AI drafts", p: ["Contract Studio output is always a draft. It is not enforceable, signed or lawyer-approved unless that process actually occurs."] },
      { h: "Verification", p: ["A verified badge means our team reviewed specific documents. It does not guarantee a person's conduct or future performance."] },
    ],
  },
  "/stories": {
    eyebrow: "Research & stories", title: "Real voices only.",
    intro: "We publish genuine research and stories — never fabricated interviews or findings.",
  },
};

const state = {
  config: null,
  session: null,
  authMode: "signin",
  mobileMenu: false,
  mobileSidebar: false,
  assistantOpen: false,
  assistantMessages: [],
  assistantConversationId: null,
  assistantBusy: false,
  activeConversation: "",
  activeContract: "",
  discoverTab: "athletes",
  discoverQuery: "",
  opportunityQuery: "",
  opportunityType: "",
  pageBusy: false,
  renderPending: false,
};

const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function titleCase(value) {
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function dateText(value, options = {}) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return options.timeStyle ? date.toLocaleString(undefined, options) : date.toLocaleDateString(undefined, options);
}

function toast(message, tone = "normal") {
  toastEl.textContent = message;
  toastEl.dataset.tone = tone;
  toastEl.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastEl.classList.remove("visible"), 3500);
}

function notice(message, tone = "") {
  return `<div class="notice ${tone}">${escapeHtml(message)}</div>`;
}

function statusPill(value) {
  const status = String(value || "pending").toLowerCase();
  const good = ["approved", "accepted", "published", "finalized", "reviewed", "completed", "resolved"];
  const bad = ["rejected", "suspended", "declined", "blocked"];
  const klass = good.includes(status) ? "" : bad.includes(status) ? "red" : "neutral";
  return `<span class="pill ${klass}">${escapeHtml(titleCase(status))}</span>`;
}

function button(label, action = "", kind = "", attrs = "") {
  return `<button type="button" class="button ${kind}" ${action ? `data-action="${escapeHtml(action)}"` : ""} ${attrs}>${escapeHtml(label)}</button>`;
}

function field(label, name, value = "", options = {}) {
  const { textarea = false, type = "text", placeholder = "", required = false, rows = 4, disabled = false } = options;
  const safe = escapeHtml(value);
  const req = required ? "required" : "";
  const dis = disabled ? "disabled" : "";
  const cls = textarea ? "" : "";
  return `<label class="field">${escapeHtml(label)}${textarea
    ? `<textarea name="${escapeHtml(name)}" rows="${rows}" placeholder="${escapeHtml(placeholder)}" ${req} ${dis} class="${cls}">${safe}</textarea>`
    : `<input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${safe}" placeholder="${escapeHtml(placeholder)}" ${req} ${dis} />`}</label>`;
}

function checkbox(label, name, checked = false) {
  return `<label class="check-row"><input type="checkbox" name="${escapeHtml(name)}" ${checked ? "checked" : ""} /><span>${escapeHtml(label)}</span></label>`;
}

function anchor(href, label, extra = "") {
  return `<a href="${escapeHtml(href)}" data-nav ${extra}>${escapeHtml(label)}</a>`;
}

async function loadConfig() {
  if (state.config) return state.config;
  const response = await fetch("/api/config");
  if (!response.ok) throw new Error("Could not load app configuration.");
  try {
    state.config = await response.json();
  } catch {
    throw new Error("The server API is not running. Deploy server.js on a Node host.");
  }
  return state.config;
}

function savedSession() {
  if (state.session) return state.session;
  try {
    state.session = JSON.parse(localStorage.getItem("mehfooz-session") || "null");
  } catch {
    state.session = null;
  }
  return state.session;
}

function storeSession(session) {
  state.session = session;
  if (session) localStorage.setItem("mehfooz-session", JSON.stringify(session));
  else localStorage.removeItem("mehfooz-session");
}

async function refreshSession() {
  const session = savedSession();
  if (!session?.refresh_token) return null;
  const config = await loadConfig();
  const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: config.publishableKey, "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const result = await response.json();
  if (!response.ok) {
    storeSession(null);
    return null;
  }
  const next = { ...result, expires_at: Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600) };
  storeSession(next);
  return next;
}

async function currentSession() {
  let session = savedSession();
  if (!session?.access_token) return null;
  if (Number(session.expires_at || 0) < Math.floor(Date.now() / 1000) + 45) session = await refreshSession();
  if (session?.access_token && !session.user) {
    try {
      const user = await authRequest("/auth/v1/user", undefined, { token: session.access_token, method: "GET" });
      session = { ...session, user };
      storeSession(session);
    } catch {
      storeSession(null);
      return null;
    }
  }
  return session;
}

async function authRequest(path, body, { token = "", method = "POST" } = {}) {
  const config = await loadConfig();
  if (!config.supabaseUrl || !config.publishableKey) throw new Error("Supabase is not configured. Add the public URL and key to the server environment.");
  const headers = { apikey: config.publishableKey, "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${config.supabaseUrl}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || "Authentication request failed.");
  return result;
}

async function dbRequest(table, { method = "GET", select = "*", filters = {}, order = "", limit = "", body, prefer = "" } = {}) {
  const config = await loadConfig();
  if (!config.supabaseUrl || !config.publishableKey) throw new Error("Supabase is not configured. Add the public URL and key to the server environment.");
  const url = new URL(`${config.supabaseUrl}/rest/v1/${table}`);
  if (select) url.searchParams.set("select", select);
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  if (order) url.searchParams.set("order", order);
  if (limit) url.searchParams.set("limit", String(limit));
  const session = await currentSession();
  const headers = {
    apikey: config.publishableKey,
    authorization: `Bearer ${session?.access_token || config.publishableKey}`,
    "content-type": "application/json",
  };
  if (prefer) headers.prefer = prefer;
  else if (["POST", "PATCH"].includes(method)) headers.prefer = "return=representation";
  const response = await fetch(url, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    const message = typeof data === "object" && data ? data.message || data.msg || data.hint || data.details : data;
    const error = new Error(message || `Data request failed (${response.status}).`);
    error.status = response.status;
    error.code = data?.code;
    throw error;
  }
  return data;
}

async function rpc(name, body = {}) {
  return dbRequest(`rpc/${name}`, { method: "POST", select: "", body });
}

function pageHeader(active = "", overlay = false) {
  const menu = navigation.map(([href, label]) => anchor(href, label, active === href ? 'class="active"' : "")).join("");
  return `<header class="site-header ${overlay ? "overlay-header" : "solid"}">
    <div class="nav-shell">
      ${anchor("/", "Mehfooz Maidan", 'class="wordmark" aria-label="Mehfooz Maidan home"')}<i aria-hidden="true"></i>
      <nav class="nav-links" aria-label="Primary">${menu}</nav>
      <div class="nav-actions">${anchor("/join", "Join the platform", 'class="button button-small button-light desktop-join"')}
        <button class="menu-toggle" type="button" aria-label="Toggle navigation" data-action="mobile-menu">☰</button>
      </div>
    </div>
    <nav class="mobile-nav ${state.mobileMenu ? "open" : ""}" aria-label="Mobile navigation">
      ${menu}${anchor("/join", "Join the platform")}
    </nav>
  </header>`;
}

function footer() {
  const platform = [
    ["/about", "About"], ["/how-it-works", "How it works"], ["/opportunities", "Opportunities"], ["/contact", "Contact & safeguarding"],
  ];
  const legal = [["/privacy", "Privacy policy"], ["/terms", "Terms of use"], ["/disclaimer", "Legal disclaimer"]];
  const links = (items) => items.map(([href, label]) => anchor(href, label)).join("");
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>${anchor("/", "Mehfooz Maidan", 'class="wordmark"')}<p class="footer-summary">One accountable ecosystem for athletes, sports professionals and lawyers in Pakistan.</p></div>
      <div class="footer-group"><p class="eyebrow">Platform</p>${links(platform)}</div>
      <div class="footer-group"><p class="eyebrow">Legal</p>${links(legal)}</div>
    </div>
    <div class="footer-bottom">© ${new Date().getFullYear()} Mehfooz Maidan. Information on this platform is not legal advice.</div>
  </footer>`;
}

function pageShell({ eyebrow, title, intro = "", content = "", active = "" }) {
  return `${pageHeader(active)}<main id="main" class="page-shell">
    <section class="container page-intro"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1>
      ${intro ? `<p class="intro">${escapeHtml(intro)}</p>` : ""}
    </section><section class="container page-content">${content}</section>
  </main>${footer()}`;
}

function prose(sections = []) {
  return `<div class="prose-list">${sections.map((section) => `<section class="prose-section">
    <h2>${escapeHtml(section.h)}</h2><div>${(section.p || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
  </section>`).join("")}</div>`;
}

function homePage() {
  const stadium = "https://mehfoozmaidan.lovable.app/__l5e/assets-v1/37c310e8-be02-4a80-ba09-1b463e483ecc/stadium.png";
  const football = "https://mehfoozmaidan.lovable.app/__l5e/assets-v1/6c9f14ac-c651-4cbc-8c93-0f077f0c2ff1/football.png";
  const runner = "https://mehfoozmaidan.lovable.app/__l5e/assets-v1/46a015dc-5933-45ca-b9af-d49f951f3863/runner.png";
  const groups = [
    ["01", "Athletes", "Build a credible sporting portfolio, control who sees it, discover opportunities and request legal help before you sign."],
    ["02", "Boards & coaches", "Find athletes by sport, level and region, run transparent recruitment, and manage your organisation's staff and permissions."],
    ["03", "Lawyers", "Receive matched requests, review agreements in protected workspaces, and support sport with verified credentials."],
  ];
  return `${pageHeader("/", true)}<main id="main">
    <section class="hero-wrap"><div class="hero">
      <img class="hero-image" src="${stadium}" alt="Football stadium with a green pitch under a blue sky" />
      <div class="hero-content"><h1>Protected<br />ground.</h1><p class="hero-copy">Opportunity, professional connection and legal access for Pakistani sport — in one accountable platform.</p>
        <div class="hero-buttons">${anchor("/join", "Join Mehfooz Maidan", 'class="button button-light"')}<a href="/mission" data-nav class="button button-outline" aria-label="Read our mission">↗</a></div>
      </div>
      <div class="hero-bottom"><p class="hero-word">maidan</p><div class="hero-tags">${["Verified profiles", "Recruitment", "Legal requests", "Contract Studio", "Safeguarding"].map((tag) => `<span>${tag}</span>`).join("")}</div></div>
    </div></section>
    <section class="container section-space"><div class="section-heading"><p class="eyebrow">// Three groups, one ecosystem</p><h2>Together.</h2></div>
      <div class="role-grid">${groups.map(([number, title, description]) => `<article class="role-card"><span class="number">${number}</span><h3>${title}</h3><p>${description}</p></article>`).join("")}</div>
    </section>
    <section class="container story-grid section-space">
      <div class="story-image"><img loading="lazy" src="${football}" alt="Football players competing for the ball" /></div>
      <div class="story-stack">
        <article class="story-card"><p class="eyebrow">Why it matters</p><h2>Talent deserves a fair contract — and a fair chance to be seen.</h2>
          <p>Many athletes sign agreements they do not fully understand, and many are never discovered at all. Mehfooz Maidan brings recruitment, verification and legal support into the same accountable space.</p>
          ${anchor("/mission", "Read our mission →", 'class="button-link"')}
        </article>
        <div class="story-photo"><img loading="lazy" src="${runner}" alt="Young athlete sprinting on an athletics track" />
          <div class="photo-caption"><strong>Contract Studio</strong><p>Draft with AI, then request review from a verified lawyer. Drafts are never presented as legal approval.</p></div>
        </div>
      </div>
    </section>
    <section id="mission-video" class="container section-space"><div class="mission-callout">
      <div><p class="eyebrow" style="color:var(--gold)">Mission film</p><h2>Our story, in our athletes' words.</h2></div>
      <div><p>The mission film will be published here by the Mehfooz Maidan team. We will not show staged or borrowed footage.</p>${anchor("/how-it-works", "See how it works →", 'class="button button-light"')}</div>
    </div></section>
  </main>${footer()}`;
}

async function blogPage(path) {
  if (path === "/blog") {
    let posts = [];
    try {
      posts = await dbRequest("site_content", {
        select: "slug,title,summary,updated_at",
        filters: { section: "eq.blog", status: "eq.published" },
        order: "updated_at.desc",
      }) || [];
    } catch (error) {
      return pageShell({ eyebrow: "Blog", title: "Notes from the maidan.", intro: "News, guides and perspectives from the Mehfooz Maidan team.", content: notice(error.message, "error"), active: "/blog" });
    }
    const content = posts.length
      ? `<div class="join-grid">${posts.map((post) => `<a data-nav class="join-card" href="/blog/${encodeURIComponent(post.slug)}"><p class="eyebrow">${escapeHtml(dateText(post.updated_at))}</p><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.summary || "")}</p><span class="button-link">Read →</span></a>`).join("")}</div>`
      : `<div class="empty-state"><h2>No posts yet</h2><p>Our team will publish blog posts here soon.</p></div>`;
    return pageShell({ eyebrow: "Blog", title: "Notes from the maidan.", intro: "News, guides and perspectives from the Mehfooz Maidan team.", content, active: "/blog" });
  }
  const slug = decodeURIComponent(path.slice("/blog/".length));
  try {
    const posts = await dbRequest("site_content", {
      select: "title,summary,body,updated_at",
      filters: { section: "eq.blog", status: "eq.published", slug: `eq.${slug}` },
      limit: 1,
    });
    const post = posts?.[0];
    if (!post) return pageShell({ eyebrow: "Blog", title: "Post not found", content: `<div class="empty-state"><h2>This post isn't available</h2><p>It may have been removed.</p>${anchor("/blog", "All posts", 'class="button"')}</div>` });
    const body = String(post.body || "").split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    return pageShell({ eyebrow: dateText(post.updated_at), title: post.title, intro: post.summary || "", content: `<article class="narrow">${body}</article><p style="margin-top:2rem">${anchor("/blog", "← All posts", 'class="button-link"')}</p>`, active: "/blog" });
  } catch (error) {
    return pageShell({ eyebrow: "Blog", title: "Notes from the maidan.", content: notice(error.message, "error"), active: "/blog" });
  }
}

function joinPage() {
  const cards = [
    ["athlete", "Athlete", "Build your sporting portfolio and discover opportunities."],
    ["sports", "Sports professional or organisation", "Coaches, scouts, clubs, academies and boards."],
    ["lawyer", "Lawyer", "Verified legal professionals supporting sport."],
  ];
  return pageShell({
    eyebrow: "Join", title: "Choose your path.",
    intro: "Each role has its own registration, verification and dashboard. Pick a portal to create your account or sign in.",
    content: `<div class="join-grid">${cards.map(([role, name, description]) => `<a data-nav href="/${role}/login" class="join-card"><h2>${name}</h2><p>${description}</p><span class="button button-small">Join this portal →</span></a>`).join("")}</div><p style="margin-top:2rem;font-size:.78rem">${anchor("/admin/login", "Admin", 'class="muted"')}</p>`,
  });
}

function authPage(role) {
  const name = roles[role] || "Member";
  const mode = state.authMode;
  const title = mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset password";
  const tagLine = role === "athlete" ? "Your sporting story, protected."
    : role === "sports" ? "Discover talent, accountably."
      : role === "lawyer" ? "Legal expertise where sport needs it."
        : "Platform administration.";
  const formFields = mode === "signup" ? `${field(role === "sports" ? "Representative's full name" : "Full name", "full_name", "", { required: true })}
    ${role === "sports" ? `<label class="field">Account type<select name="kind"><option value="individual">Individual professional</option><option value="organization">Organisation</option></select></label>` : ""}` : "";
  return `<main id="main" class="auth-layout">
    <section class="auth-panel">${anchor("/", "Mehfooz Maidan", 'class="wordmark"')}
      <div><p class="eyebrow" style="color:var(--gold)">${escapeHtml(name)} portal</p><h1>${tagLine}</h1></div>
      <p>Verification is reviewed by people. It does not guarantee selection, outcomes or the conduct of any user.</p>
    </section>
    <section class="auth-form-wrap"><div class="auth-form">
      <div class="auth-mobile-brand">${anchor("/", "Mehfooz Maidan", 'class="wordmark"')}</div>
      <h2>${title}</h2><p>${escapeHtml(name)}</p>
      <form class="form" data-form="auth" data-role="${escapeHtml(role)}" data-mode="${escapeHtml(mode)}">
        ${formFields}
        ${role !== "admin" ? field("Email", "email", "", { type: "email", required: true }) : ""}
        ${mode !== "reset" ? field("Password", "password", "", { type: "password", required: true }) : ""}
        <button class="button" type="submit">${mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
      </form>
      ${role === "athlete" && mode !== "reset" ? `<button class="button button-outline" style="width:100%;margin-top:.8rem" type="button" data-action="google-login">Continue with Google</button>` : ""}
      <div class="auth-toggle">
        <div>${role !== "admin" && mode === "signin" ? `<button class="button-link" data-action="auth-mode" data-mode="signup">Create an account</button>` : ""}
          ${mode !== "signin" ? `<button class="button-link" data-action="auth-mode" data-mode="signin">Back to sign in</button>` : ""}
        </div>
        ${mode === "signin" ? `<button class="button-link muted" data-action="auth-mode" data-mode="reset">Forgot password?</button>` : ""}
      </div>
      ${role === "admin" ? `<p class="small muted" style="margin-top:1.2rem">Administrator accounts are provisioned by the platform owner. Public registration never grants admin access.</p>` : ""}
      <p class="small muted" style="margin-top:2rem">Not a ${escapeHtml(name.toLowerCase())}? ${anchor("/join", "Choose another portal", 'class="button-link"')}</p>
    </div></section>
  </main>`;
}

function resetPasswordPage() {
  return `${pageHeader()}<main id="main" class="container" style="max-width:500px;padding-top:6rem;min-height:60vh">
    <h1 style="font-size:2.6rem">Set a new password</h1>
    <form class="form" data-form="password-reset">${field("New password", "password", "", { type: "password", required: true, placeholder: "At least 8 characters" })}
      <button class="button" type="submit">Update password</button>
    </form></main>${footer()}`;
}

function appPath() {
  return `${location.pathname}${location.search}`;
}

function pathData() {
  const url = new URL(location.href);
  // Treat /index.html (and /index.html/) as the home page, then drop trailing slashes.
  const path = url.pathname.replace(/\/index\.html\/?$/i, "/").replace(/\/+$/, "") || "/";
  const match = path.match(/^\/(athlete|sports|lawyer|admin)(?:\/([^/]+))?$/);
  const login = path.match(/^\/(athlete|sports|lawyer|admin)\/login$/);
  return { path, query: url.searchParams, portal: match ? { role: match[1], section: match[2] || "" } : null, loginRole: login?.[1] || "" };
}

function dashboardHeader(role) {
  const links = portalLinks[role] || [];
  const currentPath = pathData();
  const current = currentPath.portal?.section || "";
  const memberName = state.profile?.full_name || state.session?.user?.email || "Member";
  return `<div class="dashboard ${state.mobileSidebar ? "menu-open" : ""}">
    <div class="overlay" data-action="sidebar-close"></div>
    <div class="dashboard-layout">
      <aside class="sidebar">
        ${anchor("/", "Mehfooz Maidan", 'class="wordmark"')}
        <div class="sidebar-profile"><p class="eyebrow">${escapeHtml(roles[role])}</p><p class="name">${escapeHtml(memberName)}</p></div>
        <nav class="sidebar-nav" aria-label="Dashboard">${links.map(([section, label]) => {
          const href = `/${role}${section ? `/${section}` : ""}`;
          return `<a data-nav href="${href}" class="sidebar-link ${current === section ? "active" : ""}">${escapeHtml(label)}</a>`;
        }).join("")}</nav>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-bottom"><button data-action="logout">↗ Sign out</button></div>
      </aside>
      <div class="dashboard-main">
        <header class="dash-topbar">
          <button type="button" class="button button-outline button-small mobile-sidebar-trigger" data-action="sidebar-toggle" aria-label="Open menu">☰ Menu</button>
          ${anchor("/", "← Public site", 'class="small muted desktop-public-link"')}
          ${role !== "admin" ? anchor(`/${role}/notifications`, "Notifications", 'class="button button-outline button-small"') : ""}
        </header>
        <main id="main" class="dash-content"><div class="loading">Loading your workspace…</div></main>
      </div>
    </div>
  </div>`;
}

function dashboardTitle(title, intro = "", action = "") {
  return `<div class="dash-title-row"><div><h1>${escapeHtml(title)}</h1>${intro ? `<p>${escapeHtml(intro)}</p>` : ""}</div>${action}</div>`;
}

function empty(title, body, cta = "") {
  return `<div class="empty-state"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p>${cta}</div>`;
}

function card(title, body, extra = "") {
  return `<article class="item-card"><div class="card-top"><h3>${escapeHtml(title)}</h3>${extra}</div>${body}</article>`;
}

async function loadProfile(role, userId) {
  const baseRows = await dbRequest("profiles", { select: "*", filters: { id: `eq.${userId}` }, limit: 1 });
  const base = baseRows?.[0] || null;
  if (role === "admin") {
    const roleRows = await dbRequest("user_roles", { select: "role", filters: { user_id: `eq.${userId}`, role: "eq.admin" } });
    return { base, role: roleRows?.[0] || null, detail: null };
  }
  const rows = await dbRequest(profileTables[role], { select: "*", filters: { user_id: `eq.${userId}` }, limit: 1 });
  return { base, role: null, detail: rows?.[0] || null };
}

async function renderPortal(role, section) {
  const session = await currentSession();
  if (!session) return navigate(`/${role}/login`);
  state.session = session;
  const data = await loadProfile(role, session.user.id);
  state.profile = data.base;
  const allowed = role === "admin" ? Boolean(data.role) : data.base?.primary_role === role;
  if (!allowed) {
    app.innerHTML = `${pageHeader()}<main id="main" class="container page-shell">${empty(`This area is for ${roles[role].toLowerCase()}s`, "Your account doesn't have access to this portal.", anchor(role === "admin" ? "/join" : `/${data.base?.primary_role || "athlete"}`, "Go to my dashboard", 'class="button"'))}</main>${footer()}`;
    return;
  }
  app.innerHTML = dashboardHeader(role);
  const main = document.querySelector(".dash-content");
  try {
    main.innerHTML = await portalContent(role, section, data, session);
    if (role !== "admin") addAssistant();
  } catch (error) {
    main.innerHTML = `${notice(error.message || "Could not load this page.", "error")}<button class="button button-outline" data-action="retry-page">Try again</button>`;
  }
}

async function portalContent(role, section, data, session) {
  const userId = session.user.id;
  if (!section) {
    if (role === "admin") return adminStats();
    const links = portalLinks[role].slice(1);
    return `${dashboardTitle("Welcome back", "Everything in your workspace, one click away.")}<div class="dashboard-cards">${links.map(([key, label]) => `<a data-nav class="dash-card" href="/${role}/${key}"><strong>${escapeHtml(label)}</strong><span>→</span></a>`).join("")}</div>`;
  }
  if (section === "profile") return profilePage(role, data);
  if (section === "settings") return settingsPage(data.base);
  if (section === "opportunities") return role === "sports" ? sportsOpportunities(userId, data.detail) : athleteOpportunities(userId);
  if (section === "applications" && role === "athlete") return athleteApplications(userId);
  if (section === "discover" || section === "network") return discoverPage(role, userId, section);
  if (section === "messages") return messagesPage(userId);
  if (section === "legal") return legalPage(role, userId);
  if ((section === "requests" || section === "matters") && role === "lawyer") return lawyerRequests(userId, section === "matters");
  if (section === "contracts") return contractsPage(role, userId);
  if (section === "assistant") return assistantPage();
  if (section === "suggestions") return suggestionsPage(role, session);
  if (section === "notifications") return notificationsPage(userId);
  if (role === "admin") {
    if (["verification", "athletes", "sports", "lawyers"].includes(section)) return adminPeople(section);
    if (section === "reports") return adminReports();
    if (section === "suggestions") return adminSuggestions();
    if (section === "content") return adminContent();
    if (section === "media") return `${dashboardTitle("Media & mission video", "Publish original mission media when it has been approved by the team.")}${empty("No media published yet", "The mission film will appear on the public site when the team publishes it.")}`;
    if (section === "audit") return adminAudit();
  }
  const link = portalLinks[role].find(([key]) => key === section);
  return empty("Page not found", "This workspace section doesn't exist.", link ? "" : anchor(`/${role}`, "Back to overview", 'class="button"'));
}

async function adminStats() {
  const [athletes, sports, lawyers, openReports] = await Promise.all([
    dbRequest("athlete_profiles", { select: "user_id", filters: { status: "eq.submitted" } }).catch(() => []),
    dbRequest("sports_profiles", { select: "user_id", filters: { status: "eq.submitted" } }).catch(() => []),
    dbRequest("lawyer_profiles", { select: "user_id", filters: { status: "eq.submitted" } }).catch(() => []),
    dbRequest("reports", { select: "id", filters: { status: "eq.open" } }).catch(() => []),
  ]);
  const cards = [
    ["Pending athlete reviews", athletes.length, "/admin/athletes"], ["Pending sports reviews", sports.length, "/admin/sports"],
    ["Pending lawyer reviews", lawyers.length, "/admin/lawyers"], ["Open reports", openReports.length, "/admin/reports"],
  ];
  return `${dashboardTitle("Platform overview", "Current verification and safeguarding workload.")}<div class="dashboard-cards">${cards.map(([name, value, href]) => `<a data-nav class="dash-card" href="${href}"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(value)} →</span></a>`).join("")}</div>`;
}

function profileFormSection(title, inner) {
  return `<section class="profile-section"><h2>${escapeHtml(title)}</h2><div class="panel-grid">${inner}</div></section>`;
}

function profilePage(role, data) {
  const p = data.detail || {};
  const base = data.base || {};
  let sections = profileFormSection("Basics", `${field("Full name", "full_name", base.full_name || "", { required: true })}${field("Region / city", "region", base.region || "")}${checkbox("Allow message requests from people I'm not connected with", "contact_open", base.contact_open !== false)}`);
  if (role === "athlete") {
    sections += profileFormSection("Sport", `${field("Sport", "sport", p.sport || "", { required: true })}${field("Discipline / position", "discipline", p.discipline || "")}${field("Competition level", "level", p.level || "", { placeholder: "e.g. district, provincial, national" })}`);
    sections += `<section class="profile-section"><h2>Portfolio</h2><div class="panel-grid">${field("Biography", "bio", p.bio || "", { textarea: true })}${field("Sporting goals", "goals", p.goals || "", { textarea: true })}${field("Achievements, rankings & competition history", "achievements", p.achievements || "", { textarea: true, rows: 5 })}${field("Statistics & personal bests", "statistics", p.statistics || "", { textarea: true })}${field("Qualifications & certificates", "qualifications", p.qualifications || "", { textarea: true })}</div></section>`;
    sections += `<section class="profile-section"><h2>Visibility & safeguarding</h2><div class="panel-grid">${`<label class="field">Who can find my profile<select name="visibility"><option value="public" ${p.visibility === "public" ? "selected" : ""}>Any signed-in member (adults only)</option><option value="professionals" ${p.visibility === "professionals" ? "selected" : ""}>Verified sports professionals only</option><option value="private" ${p.visibility === "private" ? "selected" : ""}>Nobody — hidden from discovery</option></select></label>`}${checkbox("I am under 18", "is_minor", p.is_minor)}${field("Parent / guardian name (required if under 18)", "guardian_name", p.guardian_name || "")}${field("Parent / guardian email", "guardian_email", p.guardian_email || "", { type: "email" })}</div></section>`;
  } else if (role === "sports") {
    sections += profileFormSection("Professional details", `${field("Account type", "kind", p.kind || "individual", { disabled: true })}${field("Professional subtype", "subtype", p.subtype || "")}${field("Organisation name", "org_name", p.org_name || "")}${field("Job title", "title", p.title || "")}${field("Sports", "sports", p.sports || "")}${field("Qualifications", "qualifications", p.qualifications || "", { textarea: true })}${field("Website", "website", p.website || "", { type: "url" })}${field("Professional profile", "bio", p.bio || "", { textarea: true })}`);
  } else {
    sections += profileFormSection("Credentials & expertise", `${field("Bar enrollment", "bar_enrollment", p.bar_enrollment || "")}${field("Jurisdiction", "jurisdiction", p.jurisdiction || "")}${field("Expertise", "expertise", p.expertise || "")}${field("Years of experience", "experience_years", p.experience_years || "", { type: "number" })}${field("Languages", "languages", p.languages || "", { placeholder: "Urdu, English, Punjabi" })}${field("Professional profile", "bio", p.bio || "", { textarea: true })}${checkbox("Available for new requests", "available", p.available !== false)}`);
  }
  return `${dashboardTitle(role === "athlete" ? "Profile & sporting portfolio" : role === "sports" ? "Professional profile" : "Professional profile & credentials",
    "Complete your details, then submit for verification. An administrator reviews submissions and records every decision.", statusPill(p.status || "draft"))}
    ${p.status === "info_requested" ? notice("An administrator requested more information. Update your profile and resubmit.") : ""}
    ${p.status === "submitted" ? notice("Your profile is awaiting review. You can still edit, but resubmission is not needed.") : ""}
    <form class="panel profile-sections" data-form="profile" data-role="${role}">${sections}
      <div class="toolbar"><button class="button button-outline" type="submit" name="submit_mode" value="save">Save profile</button><button class="button" type="submit" name="submit_mode" value="submit">Submit for verification</button></div>
    </form>
    <div class="panel" style="margin-top:1.2rem"><div class="card-top"><div><h3>Have a suggestion?</h3><p>Tell us what would make this platform better — every suggestion is stored and reviewed by the team.</p></div>${anchor(`/${role}/suggestions`, "Open Suggestions", 'class="button button-outline"')}</div></div>`;
}

function settingsPage(profile) {
  return `${dashboardTitle("Settings", "Manage your public profile and sign-in preferences.")}<form class="panel form" data-form="settings">
    ${field("Full name", "full_name", profile?.full_name || "", { required: true })}
    ${field("Region / city", "region", profile?.region || "")}
    ${checkbox("Allow message requests from people I'm not connected with", "contact_open", profile?.contact_open !== false)}
    <button class="button" type="submit">Save settings</button>
  </form>`;
}

async function athleteOpportunities(userId) {
  const [opportunities, applications] = await Promise.all([
    dbRequest("opportunities", { select: "*", filters: { status: "eq.published" }, order: "created_at.desc" }),
    dbRequest("applications", { select: "opportunity_id", filters: { athlete_id: `eq.${userId}` } }).catch(() => []),
  ]);
  const applied = new Set((applications || []).map((item) => item.opportunity_id));
  const query = state.opportunityQuery.toLowerCase();
  const filtered = (opportunities || []).filter((item) =>
    (!state.opportunityType || item.opp_type === state.opportunityType) &&
    `${item.title} ${item.sport} ${item.region}`.toLowerCase().includes(query));
  const cards = filtered.map((item) => `<article class="item-card"><p class="eyebrow">${escapeHtml(titleCase(item.opp_type))} · ${escapeHtml(item.sport)}</p>
    <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || "")}</p><div class="status-row"><span class="small muted">${escapeHtml(item.region || "")}${item.deadline ? ` · closes ${escapeHtml(dateText(item.deadline))}` : ""}</span>
    ${applied.has(item.id) ? statusPill("applied") : `<button class="button button-small" data-action="apply" data-id="${escapeHtml(item.id)}">Apply</button>`}</div></article>`).join("");
  return `${dashboardTitle("Discover opportunities", "Published trials, recruitment drives, scholarships and more from sports professionals and organisations. Opportunities do not guarantee selection.")}
    <div class="toolbar"><input class="search-input" data-filter="opportunities" value="${escapeHtml(state.opportunityQuery)}" placeholder="Search sport, region, title" />
      <select class="control" data-filter="opportunity-type" style="max-width:220px"><option value="">All types</option>${opportunityTypes.map((type) => `<option ${state.opportunityType === type ? "selected" : ""}>${type}</option>`).join("")}</select></div>
    ${cards ? `<div class="panel-grid">${cards}</div>` : empty("No opportunities yet", "When verified organisations publish trials or roles, they will appear here.")}`;
}

async function athleteApplications(userId) {
  const applications = await dbRequest("applications", {
    select: "*, opportunities(title,sport,opp_type,region)",
    filters: { athlete_id: `eq.${userId}` }, order: "updated_at.desc",
  });
  const rows = (applications || []).map((item) => `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(item.opportunities?.title || "Opportunity")}</h3><p>${escapeHtml(item.opportunities?.opp_type || "")} · ${escapeHtml(item.opportunities?.sport || "")} · ${escapeHtml(item.opportunities?.region || "")}</p></div>${statusPill(item.stage)}</div>
    <div class="card-actions">${item.stage === "invited" ? `<button class="button button-small" data-action="application-stage" data-id="${escapeHtml(item.id)}" data-stage="applied">Accept invitation</button>` : ""}
    ${item.stage === "offer" ? `<button class="button button-small" data-action="application-stage" data-id="${escapeHtml(item.id)}" data-stage="accepted">Accept offer</button>` : ""}
    ${!["withdrawn", "rejected", "accepted"].includes(item.stage) ? `<button class="button button-outline button-small" data-action="application-stage" data-id="${escapeHtml(item.id)}" data-stage="${item.stage === "invited" ? "rejected" : "withdrawn"}">${item.stage === "invited" ? "Decline" : "Withdraw"}</button>` : ""}
    </div></article>`).join("");
  return `${dashboardTitle("Applications & invitations", "Track every application and respond to recruitment invitations.")}${rows ? `<div class="list-stack">${rows}</div>` : empty("Nothing here yet", "Apply to an opportunity or wait for an invitation from a verified organisation.")}`;
}

async function sportsOpportunities(userId, profile) {
  const opportunities = await dbRequest("opportunities", {
    select: "*, applications(id,stage,athlete_id,message,notes,profiles:athlete_id(full_name))",
    filters: { owner_id: `eq.${userId}` }, order: "created_at.desc",
  });
  const canPublish = profile?.status === "approved";
  const list = (opportunities || []).map((item) => `<article class="item-card"><div class="card-top"><div><p class="eyebrow">${escapeHtml(titleCase(item.opp_type))} · ${escapeHtml(item.sport)}</p><h3>${escapeHtml(item.title)}</h3></div>${statusPill(item.status)}</div>
    <p>${escapeHtml(item.description || "")}</p><p>${(item.applications || []).length} application(s) · ${escapeHtml(item.region || "")}</p>
    <div class="card-actions">${item.status === "draft" ? `<button class="button button-small" data-action="publish-opportunity" data-id="${escapeHtml(item.id)}">Publish</button>` : `<button class="button button-outline button-small" data-action="publish-opportunity" data-id="${escapeHtml(item.id)}" data-status="draft">Unpublish</button>`}</div>
    ${(item.applications || []).map((application) => `<div class="panel" style="margin-top:.8rem"><strong>${escapeHtml(application.profiles?.full_name || "Athlete")}</strong> ${statusPill(application.stage)}<p>${escapeHtml(application.message || "")}</p>
      <div class="toolbar">${["shortlisted", "trial", "offer", "accepted", "rejected"].map((stage) => `<button class="button button-outline button-small" data-action="application-stage" data-id="${escapeHtml(application.id)}" data-stage="${stage}">${titleCase(stage)}</button>`).join("")}</div>
      <form data-form="application-note" data-id="${escapeHtml(application.id)}" class="form">${field("Private pipeline note", "notes", application.notes || "", { textarea: true, rows: 2 })}<button class="button button-outline button-small" type="submit">Save note</button></form>
    </div>`).join("")}
  </article>`).join("");
  const createForm = `<form class="panel form" data-form="opportunity">
    ${field("Title", "title", "", { required: true })}
    <div class="form-row"><label class="field">Type<select name="opp_type">${opportunityTypes.map((type) => `<option>${type}</option>`).join("")}</select></label>${field("Sport", "sport", "", { required: true })}</div>
    <div class="form-row">${field("Region", "region")}${field("Application deadline", "deadline", "", { type: "date" })}</div>
    ${field("Description", "description", "", { textarea: true, required: true })}
    ${checkbox("Publish immediately", "publish", false)}
    <button class="button" type="submit">Save opportunity</button></form>`;
  return `${dashboardTitle("Opportunities & recruitment", "Publish opportunities and move applicants through your pipeline: applied → shortlisted → trial → offer → outcome.", canPublish ? `<button class="button button-small" data-action="toggle-create-opportunity">New opportunity</button>` : "")}
    ${canPublish ? `<div id="create-opportunity" class="stack" hidden>${createForm}</div>` : notice("Only verified accounts can publish opportunities. Complete your profile and submit it for verification.")}
    ${list ? `<div class="list-stack">${list}</div>` : empty("No opportunities yet", "Create your first listing after your account has been verified.")}`;
}

async function discoverPage(role, userId, section) {
  const allowedTabs = role === "sports" || role === "lawyer" ? ["athletes", "sports", "lawyers"] : ["athletes", "sports", "lawyers"];
  const tab = allowedTabs.includes(state.discoverTab) ? state.discoverTab : role === "sports" ? "athletes" : "sports";
  let rows = [];
  let dataError = "";
  try {
    if (section === "network") {
      const connections = await dbRequest("connections", {
        select: "id,requester_id,addressee_id,status,profiles:requester_id(full_name,primary_role)",
        filters: { or: `(requester_id.eq.${userId},addressee_id.eq.${userId})` },
        order: "created_at.desc",
      });
      rows = (connections || []).map((item) => ({ ...item, name: item.profiles?.full_name || "Member", label: `${item.status} connection` }));
    } else {
      const table = { athletes: "athlete_profiles", sports: "sports_profiles", lawyers: "lawyer_profiles" }[tab];
      rows = await dbRequest(table, {
        select: "*,profiles!inner(id,full_name,region)",
        filters: { status: "eq.approved", "profiles.id": `neq.${userId}` },
        order: "updated_at.desc",
      }) || [];
    }
  } catch (error) { dataError = error.message; }
  const filtered = rows.filter((item) => {
    const profile = item.profiles || {};
    const text = `${profile.full_name || item.name} ${profile.region || ""} ${item.sport || ""} ${item.discipline || ""} ${item.level || ""} ${item.expertise || ""} ${item.jurisdiction || ""} ${item.org_name || ""} ${item.subtype || ""}`.toLowerCase();
    return text.includes(state.discoverQuery.toLowerCase());
  });
  const cards = filtered.map((item) => {
    const profile = item.profiles || {};
    const label = section === "network" ? item.label : tab === "athletes"
      ? `${item.sport || ""}${item.discipline ? ` · ${item.discipline}` : ""}${item.level ? ` · ${item.level}` : ""}`
      : tab === "sports" ? `${titleCase(item.subtype || "")}${item.org_name ? ` · ${item.org_name}` : ""}${item.sports ? ` · ${item.sports}` : ""}`
        : `${item.jurisdiction || ""}${item.experience_years ? ` · ${item.experience_years} yrs` : ""}${item.languages ? ` · ${item.languages}` : ""}`;
    const personId = item.user_id || item.requester_id || item.addressee_id;
    return `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(profile.full_name || item.name || "Verified member")}</h3><p>${escapeHtml(label)}${profile.region ? ` · ${escapeHtml(profile.region)}` : ""}</p></div>${statusPill(section === "network" ? item.status : "approved")}</div>
      ${item.bio ? `<p>${escapeHtml(item.bio)}</p>` : ""}
      ${section !== "network" ? `<div class="card-actions"><button class="button button-small" data-action="connect" data-id="${escapeHtml(personId)}">Connect</button><button class="button button-outline button-small" data-action="message-person" data-id="${escapeHtml(personId)}">Message</button><button class="button button-outline button-small" data-action="save-person" data-id="${escapeHtml(personId)}">Save</button><button class="button-link" data-action="report-person" data-id="${escapeHtml(personId)}">Report</button></div>` : ""}
    </article>`;
  }).join("");
  return `${dashboardTitle(section === "network" ? "Connections & saved profiles" : role === "sports" ? "Athlete discovery" : "Find professionals",
    "Only verified profiles appear here, and athletes control who can see them. Connecting never grants access to private records.")}
    ${section !== "network" ? `<div class="toolbar">${allowedTabs.map((value) => `<button class="button ${tab === value ? "" : "button-outline"} button-small" data-action="discover-tab" data-tab="${value}">${value === "sports" ? "Coaches & organisations" : titleCase(value)}</button>`).join("")}</div>` : ""}
    <div class="toolbar"><input class="search-input" data-filter="discover" value="${escapeHtml(state.discoverQuery)}" placeholder="Search profiles" /></div>
    ${dataError ? notice(dataError, "error") : ""}
    ${cards ? `<div class="panel-grid">${cards}</div>` : empty("No matching verified profiles", section === "network" ? "Your connections and saved profiles will appear here." : "Verified profiles will appear here as people join.")}`;
}

async function messagesPage(userId) {
  const conversations = await dbRequest("conversations", {
    select: "id,kind,last_message_at,conversation_participants(user_id,accepted,last_read_at,profiles(full_name,primary_role))",
    order: "last_message_at.desc",
  }).catch(() => []);
  const list = (conversations || []).map((conversation) => {
    const others = (conversation.conversation_participants || []).filter((participant) => participant.user_id !== userId);
    const me = (conversation.conversation_participants || []).find((participant) => participant.user_id === userId);
    return { ...conversation, me, title: others.map((item) => item.profiles?.full_name || "Member").join(", ") || "Conversation" };
  });
  const selected = state.activeConversation || new URLSearchParams(location.search).get("c") || "";
  const current = list.find((conversation) => conversation.id === selected);
  let messages = [];
  if (current) {
    messages = await dbRequest("messages", { select: "*", filters: { conversation_id: `eq.${current.id}` }, order: "created_at.asc" }).catch(() => []);
    await dbRequest("conversation_participants", {
      method: "PATCH", filters: { conversation_id: `eq.${current.id}`, user_id: `eq.${userId}` },
      body: { last_read_at: new Date().toISOString() },
    }).catch(() => null);
  }
  const sidebar = list.length ? list.map((conversation) => `<button class="conversation-button ${current?.id === conversation.id ? "active" : ""}" data-action="open-conversation" data-id="${escapeHtml(conversation.id)}">
    <strong>${escapeHtml(conversation.title)}</strong><span>${conversation.kind === "legal" ? "Legal case workspace" : conversation.me?.accepted ? "Conversation" : "Message request"}</span></button>`).join("") : `<p class="small muted" style="padding:.8rem">No conversations yet. Start one from a profile.</p>`;
  const thread = current ? (messages || []).map((message) => `<div class="bubble ${message.sender_id === userId ? "mine" : ""}">${escapeHtml(message.body)}<div class="small" style="opacity:.65;margin-top:.3rem">${escapeHtml(dateText(message.created_at, { dateStyle: "short", timeStyle: "short" }))}</div></div>`).join("") : empty("Select a conversation", "Choose a conversation on the left.");
  const actions = current && !current.me?.accepted ? `<div class="notice">This person isn't connected with you. Accept to reply.<div class="toolbar" style="margin:.8rem 0 0"><button class="button button-small" data-action="accept-conversation" data-id="${escapeHtml(current.id)}">Accept</button><button class="button button-outline button-small" data-action="decline-conversation" data-id="${escapeHtml(current.id)}">Decline</button></div></div>` : "";
  return `${dashboardTitle("Messages", "Private conversations are visible only to participants. Messages are not end-to-end encrypted.")}
    <div class="message-layout"><aside class="conversation-list"><input class="search-input" data-filter="conversation-search" placeholder="Search conversations" />${sidebar}</aside>
      <section class="message-panel">${current ? `<div class="panel" style="padding:.8rem"><strong>${escapeHtml(current.title)}</strong>${current.kind === "legal" ? `<p class="small muted" style="margin:.3rem 0 0">Confidential legal workspace — only the client and assigned lawyer can read this.</p>` : ""}</div>${actions}<div class="message-thread">${thread || `<p class="small muted">No messages yet.</p>`}</div>
        ${current.me?.accepted ? `<form class="message-compose" data-form="message" data-conversation="${escapeHtml(current.id)}"><textarea class="control" name="body" rows="2" required maxlength="5000" placeholder="Write a message…"></textarea><button class="button" type="submit">Send</button></form>` : ""}`
      : thread}</section>
    </div>`;
}

async function legalPage(role, userId) {
  const own = role === "lawyer";
  const rows = await dbRequest("legal_requests", {
    select: "*,profiles:requester_id(full_name,region)",
    filters: own ? (location.pathname.endsWith("/matters") ? { lawyer_id: `eq.${userId}` } : { status: "eq.open" }) : { requester_id: `eq.${userId}` },
    order: "created_at.desc",
  }).catch((error) => {
    toast(error.message);
    return [];
  });
  const cards = (rows || []).map((request) => `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(request.summary)}</h3><p>${escapeHtml(request.category)} · ${escapeHtml(request.jurisdiction)}${request.profiles?.full_name ? ` · ${escapeHtml(request.profiles.full_name)}` : ""}</p></div>${statusPill(request.status)}</div>
    <p>${escapeHtml(request.description || "")}</p>${request.deadline ? `<p class="small muted">Deadline: ${escapeHtml(dateText(request.deadline))}</p>` : ""}
    ${own && request.status === "open" ? `<div class="card-actions"><button class="button button-small" data-action="accept-legal" data-id="${escapeHtml(request.id)}">Accept request</button><button class="button button-outline button-small" data-action="decline-legal" data-id="${escapeHtml(request.id)}">Decline</button></div>` : ""}
    ${!own && ["open", "accepted", "in_progress"].includes(request.status) ? `<div class="card-actions"><button class="button button-outline button-small" data-action="close-legal" data-id="${escapeHtml(request.id)}" data-status="${request.status === "open" ? "withdrawn" : "closed"}">${request.status === "open" ? "Withdraw" : "Close"}</button></div>` : ""}
  </article>`).join("");
  if (own) return `${dashboardTitle(location.pathname.endsWith("/matters") ? "Assigned matters" : "Incoming legal requests", "Review requests from athletes and sports organisations.")}
    ${cards ? `<div class="list-stack">${cards}</div>` : empty("No requests yet", "Requests will appear here when they match your account.")}`;
  const form = `<form class="panel form" data-form="legal-request">
    <div class="form-row"><label class="field">Category<select name="category">${["Contract dispute", "Selection / discrimination", "Safeguarding / harassment", "Doping / disciplinary", "Payment / wages", "Image rights / sponsorship", "Other"].map((item) => `<option>${item}</option>`).join("")}</select></label>
    <label class="field">Jurisdiction<select name="jurisdiction">${["Federal (Pakistan)", "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "AJK", "Not sure"].map((item) => `<option>${item}</option>`).join("")}</select></label></div>
    ${field("One-line summary", "summary", "", { required: true })}
    ${field("What happened? Avoid sharing sensitive documents here.", "description", "", { textarea: true, required: true })}
    <div class="form-row">${field("Preferred language", "language")}${field("Deadline", "deadline", "", { type: "date" })}</div>
    <button class="button" type="submit">Submit request</button></form>`;
  return `${dashboardTitle("Legal assistance", "Describe your issue. Verified lawyers can accept it, then a private case chat opens in Messages.")}
    <div class="two-col"><div>${form}</div><div class="list-stack">${cards || empty("No requests yet", "Your legal requests will appear here.")}</div></div>`;
}

async function lawyerRequests(userId, matters) {
  const rows = await dbRequest("legal_requests", {
    select: "*,profiles:requester_id(full_name,region)",
    filters: matters ? { lawyer_id: `eq.${userId}` } : { status: "eq.open" },
    order: "created_at.desc",
  }).catch(() => []);
  const items = (rows || []).map((request) => `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(request.summary)}</h3><p>${escapeHtml(request.profiles?.full_name || "Member")} · ${escapeHtml(request.category)} · ${escapeHtml(request.jurisdiction)}</p></div>${statusPill(request.status)}</div>
    <p>${escapeHtml(request.description || "")}</p>${request.status === "open" && !matters ? `<div class="card-actions"><button class="button button-small" data-action="accept-legal" data-id="${escapeHtml(request.id)}">Accept</button><button class="button button-outline button-small" data-action="decline-legal" data-id="${escapeHtml(request.id)}">Decline</button></div>` : ""}
    ${matters && ["accepted", "in_progress"].includes(request.status) ? `<div class="card-actions"><button class="button button-outline button-small" data-action="close-legal" data-id="${escapeHtml(request.id)}" data-status="closed">Close matter</button></div>` : ""}
  </article>`).join("");
  return `${dashboardTitle(matters ? "Assigned matters" : "Incoming requests", "Review requests from athletes, coaches and organisations.")}${items ? `<div class="list-stack">${items}</div>` : empty("No requests yet", "New legal requests will appear here.")}`;
}

async function contractsPage(role, userId) {
  const contractId = state.activeContract || new URLSearchParams(location.search).get("contract");
  if (contractId) return contractDetail(role, userId, contractId);
  const owner = role !== "lawyer";
  const rows = await dbRequest("contracts", {
    select: "*", filters: owner ? { owner_id: `eq.${userId}` } : { lawyer_id: `eq.${userId}` }, order: "updated_at.desc",
  }).catch(() => []);
  const list = (rows || []).map((item) => `<button class="item-card" style="width:100%;text-align:left;cursor:pointer" data-action="open-contract" data-id="${escapeHtml(item.id)}">
    <div class="card-top"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.agreement_type)} · updated ${escapeHtml(dateText(item.updated_at))}</p></div>${statusPill(item.status)}</div></button>`).join("");
  const form = `<form class="panel form" data-form="contract">
    <h2>New agreement</h2>${field("Title", "title", "", { required: true })}
    <label class="field">Agreement type<select name="type">${agreementTypes.map((type) => `<option>${escapeHtml(type)}</option>`).join("")}</select></label>
    <div class="form-row">${field("First party (name, role)", "p1", "", { required: true })}${field("Second party (name, role)", "p2", "", { required: true })}</div>
    <div class="form-row">${field("Duration / term", "term")}${field("Payment / compensation", "payment")}</div>
    ${field("Duties & obligations", "duties", "", { textarea: true, rows: 2 })}
    ${field("Termination conditions", "termination", "", { textarea: true, rows: 2 })}
    ${field("Anything else", "other", "", { textarea: true, rows: 2 })}
    ${checkbox("Involves a minor (under 18)", "minor")}${checkbox("Guardian consent obtained", "consent")}
    <button class="button" type="submit">Create agreement</button></form>`;
  return `${dashboardTitle(owner ? "Contract Studio" : "Contract review queue", owner
    ? "Create a working draft and request review from a verified lawyer. AI output is not legal advice."
    : "Agreements clients have shared with you for review.")}
    <div class="${owner ? "two-col" : ""}">${owner ? form : ""}<div class="list-stack">${list || empty(owner ? "No agreements yet" : "Queue is empty", owner ? "Create your first agreement to get started." : "Contracts shared with you will appear here.")}</div></div>`;
}

async function contractDetail(role, userId, id) {
  const [contracts, versions, comments] = await Promise.all([
    dbRequest("contracts", { select: "*", filters: { id: `eq.${id}` }, limit: 1 }),
    dbRequest("contract_versions", { select: "*", filters: { contract_id: `eq.${id}` }, order: "version.desc" }).catch(() => []),
    dbRequest("contract_comments", { select: "*", filters: { contract_id: `eq.${id}` }, order: "created_at.asc" }).catch(() => []),
  ]);
  const contract = contracts?.[0];
  if (!contract) return empty("Contract not found", "This agreement is unavailable.", `<button class="button" data-action="back-contracts">Back to agreements</button>`);
  const latest = versions?.[0];
  const owner = contract.owner_id === userId;
  const commentCards = (comments || []).map((comment) => `<article class="item-card"><p>${escapeHtml(comment.body)}</p><p class="small muted">${escapeHtml(dateText(comment.created_at, { dateStyle: "short", timeStyle: "short" }))}</p></article>`).join("");
  return `<button class="button-link" data-action="back-contracts">← Back to agreements</button>
    ${dashboardTitle(contract.title, `${contract.agreement_type}${contract.involves_minor ? " · involves a minor" : ""}`, statusPill(contract.status))}
    <div class="two-col"><div class="stack">
      <div class="toolbar">${owner ? `<button class="button button-small" data-action="draft-contract" data-id="${escapeHtml(id)}">${latest ? "Regenerate AI draft" : "Generate AI draft"}</button>` : ""}
        ${latest ? `<button class="button button-outline button-small" data-action="edit-version">Edit as new version</button><button class="button button-outline button-small" data-action="download-version">Download</button>` : ""}
        ${owner && latest && contract.status !== "finalized" ? `<button class="button button-outline button-small" data-action="contract-status" data-id="${escapeHtml(id)}" data-status="finalized">Mark finalized</button>` : ""}
      </div>
      ${latest ? `<div class="panel"><p class="eyebrow">Version ${escapeHtml(latest.version)} · ${latest.ai_generated ? "AI-generated — not lawyer-reviewed" : escapeHtml(latest.note || "Edited version")}</p><pre id="contract-body">${escapeHtml(latest.body)}</pre></div>` : empty("No draft yet", owner ? "Generate an AI draft from your answers." : "The owner hasn't drafted this yet.")}
      ${contract.concerns ? `<div class="panel"><h2>AI review notes</h2><pre>${escapeHtml(contract.concerns)}</pre></div>` : ""}
      <form class="panel form" data-form="contract-comment" data-id="${escapeHtml(id)}"><h2>Comments</h2><div class="list-stack">${commentCards || `<p class="muted small">No comments yet.</p>`}</div>${field("Add a comment", "body", "", { required: true })}<button class="button" type="submit">Post comment</button></form>
    </div><div class="stack">
      ${owner ? `<div class="panel"><h2>Request lawyer review</h2><p class="muted small">${contract.lawyer_id ? "This agreement has been shared with a lawyer." : "Choose a verified lawyer to request review."}</p>
        <button class="button button-outline button-small" data-action="share-contract" data-id="${escapeHtml(id)}" ${contract.lawyer_id ? "disabled" : ""}>Find a verified lawyer</button></div>` : ""}
      <div class="panel"><h2>Version history</h2>${(versions || []).map((version) => `<p class="small muted">v${escapeHtml(version.version)} · ${version.ai_generated ? "AI" : escapeHtml(version.note || "Edited")} · ${escapeHtml(dateText(version.created_at))}</p>`).join("") || `<p class="small muted">No versions yet.</p>`}</div>
    </div></div>`;
}

async function notificationsPage(userId) {
  const rows = await dbRequest("notifications", { select: "*", filters: { user_id: `eq.${userId}` }, order: "created_at.desc", limit: 100 }).catch(() => []);
  const items = (rows || []).map((item) => `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(item.title || titleCase(item.type || "Notification"))}</h3><p>${escapeHtml(item.body || item.message || "")}</p></div>${item.read_at ? "" : statusPill("unread")}</div><p class="small muted">${escapeHtml(dateText(item.created_at, { dateStyle: "medium", timeStyle: "short" }))}</p>
    ${!item.read_at ? `<button class="button button-outline button-small" data-action="mark-read" data-id="${escapeHtml(item.id)}">Mark as read</button>` : ""}</article>`).join("");
  return `${dashboardTitle("Notifications", "Updates about your profile, applications and conversations.")}${items ? `<div class="list-stack">${items}</div>` : empty("You're all caught up", "New updates will appear here.")}`;
}

async function suggestionsPage(role, session) {
  const rows = await dbRequest("suggestions", {
    select: "*",
    filters: { user_id: `eq.${session.user.id}` },
    order: "created_at.desc",
    limit: 50,
  }).catch(() => []);
  const items = (rows || []).map((item) => `<article class="item-card"><div class="card-top"><div><h3>${escapeHtml(item.subject)}</h3><p>${escapeHtml(item.body)}</p></div>${statusPill(item.status)}</div>
    ${item.legal_impact ? `<p class="small"><strong>Legal impact:</strong> ${escapeHtml(item.legal_impact)}</p>` : ""}
    ${item.admin_notes ? `<p class="small muted">Team note: ${escapeHtml(item.admin_notes)}</p>` : ""}
    <p class="small muted">Sent ${escapeHtml(dateText(item.created_at, { dateStyle: "medium", timeStyle: "short" }))}</p></article>`).join("");
  return `${dashboardTitle("Suggestions", "Help us improve Mehfooz Maidan. Every suggestion is stored safely and reviewed by the team.")}
    <form class="panel form" data-form="suggestion" data-role="${role}">
      ${field("Subject", "subject", "", { required: true, placeholder: "What is your suggestion about?" })}
      ${field("Your suggestion", "body", "", { textarea: true, required: true, placeholder: "Tell us what would make the platform better for you." })}
      ${field("Legal impact", "legal_impact", "", { textarea: true, placeholder: "Could this idea affect laws, contracts, consent, privacy or the safety of minors? Describe any legal concerns or benefits (optional)." })}
      <button class="button" type="submit">Send suggestion</button>
    </form>
    ${items ? `<h2 style="margin-top:2rem;font-size:1.4rem">Your suggestions</h2><div class="list-stack">${items}</div>` : ""}`;
}

async function adminSuggestions() {
  const rows = await dbRequest("suggestions", {
    select: "*,profile:user_id(full_name,primary_role)",
    order: "created_at.desc",
    limit: 100,
  }).catch(() => []);
  const cards = (rows || []).map((item) => `<article class="item-card"><div class="card-top"><div><p class="eyebrow">${escapeHtml(roles[item.role] || item.role || "Member")}</p><h3>${escapeHtml(item.subject)}</h3><p>${escapeHtml(item.profile?.full_name || "Member")}</p></div>${statusPill(item.status)}</div>
    <p>${escapeHtml(item.body)}</p>${item.legal_impact ? `<p class="small"><strong>Legal impact:</strong> ${escapeHtml(item.legal_impact)}</p>` : ""}<p class="small muted">Sent ${escapeHtml(dateText(item.created_at, { dateStyle: "medium", timeStyle: "short" }))}</p>
    <div class="card-actions">${["reviewing", "planned", "done", "declined"].map((status) => `<button class="button button-outline button-small" data-action="suggestion-status" data-id="${escapeHtml(item.id)}" data-status="${status}">${titleCase(status)}</button>`).join("")}</div></article>`).join("");
  return `${dashboardTitle("Suggestions", "Member suggestions from every portal. Record a decision so members see the outcome.")}${cards ? `<div class="list-stack">${cards}</div>` : empty("No suggestions yet", "Suggestions submitted by members will appear here.")}`;
}

async function adminPeople(section) {
  const tables = section === "verification" ? Object.entries(profileTables) : [[section === "athletes" ? "athlete" : section, profileTables[section === "athletes" ? "athlete" : section]]];
  const data = await Promise.all(tables.map(async ([role, table]) => {
    const profiles = await dbRequest(table, { select: "*,profiles!inner(id,full_name,region)", filters: section === "verification" ? { status: "in.(submitted,info_requested)" } : {}, order: "updated_at.desc" }).catch(() => []);
    return { role, profiles: profiles || [] };
  }));
  const items = data.flatMap(({ role, profiles }) => profiles.map((profile) => `<article class="item-card"><div class="card-top"><div><p class="eyebrow">${escapeHtml(roles[role])}</p><h3>${escapeHtml(profile.profiles?.full_name || "Member")}</h3><p>${escapeHtml(profile.sport || profile.org_name || profile.expertise || profile.subtype || "")}${profile.profiles?.region ? ` · ${escapeHtml(profile.profiles.region)}` : ""}</p></div>${statusPill(profile.status)}</div>
    <p>${escapeHtml(profile.bio || "")}</p><div class="card-actions">
      <button class="button button-small" data-action="verification-decision" data-role="${escapeHtml(role)}" data-id="${escapeHtml(profile.user_id)}" data-status="approved">Approve</button>
      <button class="button button-outline button-small" data-action="verification-decision" data-role="${escapeHtml(role)}" data-id="${escapeHtml(profile.user_id)}" data-status="info_requested">Request info</button>
      <button class="button button-outline button-small" data-action="verification-decision" data-role="${escapeHtml(role)}" data-id="${escapeHtml(profile.user_id)}" data-status="rejected">Reject</button>
    </div></article>`)).join("");
  return `${dashboardTitle(section === "verification" ? "Verification queue" : titleCase(section), "Review submitted information and record an explicit decision.")}${items ? `<div class="list-stack">${items}</div>` : empty("No profiles to review", "New submissions will appear here.")}`;
}

async function adminReports() {
  const reports = await dbRequest("reports", { select: "*,profiles:reporter_id(full_name)", order: "created_at.desc", limit: 100 }).catch(() => []);
  const cards = (reports || []).map((report) => `<article class="item-card"><div class="card-top"><div><p class="eyebrow">${escapeHtml(titleCase(report.category || "Report"))}</p><h3>${escapeHtml(report.profiles?.full_name || "Member report")}</h3></div>${statusPill(report.status)}</div>
    <p>${escapeHtml(report.reason || "")}</p><p class="small muted">${escapeHtml(dateText(report.created_at))}</p>
    <div class="card-actions">${["reviewing", "resolved", "dismissed"].map((status) => `<button class="button button-outline button-small" data-action="report-status" data-id="${escapeHtml(report.id)}" data-status="${status}">${titleCase(status)}</button>`).join("")}</div>
  </article>`).join("");
  return `${dashboardTitle("Reports & safeguarding", "Review reports carefully and document the outcome.")}${cards ? `<div class="list-stack">${cards}</div>` : empty("No reports", "Submitted reports will appear here.")}`;
}

async function adminContent() {
  const rows = await dbRequest("site_content", { select: "*", order: "updated_at.desc", limit: 100 }).catch(() => []);
  const cards = (rows || []).map((item) => `<article class="item-card"><div class="card-top"><div><p class="eyebrow">${escapeHtml(titleCase(item.section))}</p><h3>${escapeHtml(item.title)}</h3></div>${statusPill(item.status)}</div><p>${escapeHtml(item.summary || "")}</p><p class="small muted">/${escapeHtml(item.slug || "")} · Updated ${escapeHtml(dateText(item.updated_at))}</p></article>`).join("");
  return `${dashboardTitle("Content & blog", "Review published site content. Draft editing remains available through the existing content workflow.")}${cards ? `<div class="list-stack">${cards}</div>` : empty("No content yet", "Published and draft content will appear here.")}`;
}

async function adminAudit() {
  const rows = await dbRequest("audit_logs", { select: "*", order: "created_at.desc", limit: 100 }).catch(() => []);
  const items = (rows || []).map((item) => `<article class="item-card"><div class="card-top"><h3>${escapeHtml(titleCase(item.action || item.event_type || "Activity"))}</h3><span class="small muted">${escapeHtml(dateText(item.created_at, { dateStyle: "medium", timeStyle: "short" }))}</span></div><p>${escapeHtml(item.entity_type || "")}${item.entity_id ? ` · ${escapeHtml(item.entity_id)}` : ""}</p></article>`).join("");
  return `${dashboardTitle("Audit log", "Recent recorded actions across the platform.")}${items ? `<div class="list-stack">${items}</div>` : empty("No recent entries", "Audit events will appear here when available.")}`;
}

function assistantMarkup() {
  const messages = state.assistantMessages.map((message) => `<div class="chat-message ${message.role === "user" ? "user" : ""}">${escapeHtml(message.content)}</div>`).join("");
  return `<button class="assistant-fab" type="button" data-action="assistant-toggle" aria-label="Open Mehfooz Assistant">✦</button>
    <section class="assistant-dialog ${state.assistantOpen ? "open" : ""}" role="dialog" aria-label="Mehfooz Assistant">
      <div class="assistant-head"><div><h2>Mehfooz Assistant</h2><span class="small muted">${savedSession() ? "Tailored to your role" : "Public guidance"}</span></div>
        <div><button class="button-link" data-action="assistant-new" aria-label="New conversation">＋</button><button class="button-link" data-action="assistant-toggle" aria-label="Close">×</button></div></div>
      <div class="chat-thread">${messages || `<p class="small muted">How can I help?</p><div class="suggestions">${["How does verification work?", "What should I check before signing a sponsorship agreement?", "Help me prepare questions for a lawyer", "How do I use Contract Studio?"].map((text) => `<button class="suggestion" data-action="assistant-suggestion" data-text="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("")}</div>`}
      ${state.assistantBusy ? `<p class="small muted">Mehfooz Assistant is thinking…</p>` : ""}</div>
      <form class="message-compose" data-form="assistant"><textarea class="control" name="message" rows="2" maxlength="4000" placeholder="Ask about the platform, contracts or your rights…" required></textarea><button class="button button-small" type="submit" ${state.assistantBusy ? "disabled" : ""}>Send</button></form>
      <p class="legal-disclaimer">General information only — not legal advice. AI processing is used; don't share confidential documents or ID numbers.</p>
    </section>`;
}

function addAssistant() {
  document.body.insertAdjacentHTML("beforeend", assistantMarkup());
}

async function assistantPage() {
  return `${dashboardTitle("Mehfooz Assistant", "General information only — not legal advice. Avoid sharing confidential documents or ID numbers.")}
    <div class="panel"><div id="assistant-page-messages" class="chat-thread">${state.assistantMessages.map((message) => `<div class="chat-message ${message.role === "user" ? "user" : ""}">${escapeHtml(message.content)}</div>`).join("") || `<p class="muted">Ask about the platform, contracts or your rights.</p>`}</div>
      <form class="message-compose" data-form="assistant"><textarea class="control" name="message" rows="2" maxlength="4000" placeholder="Write a message…" required></textarea><button class="button" type="submit">Send</button></form>
      <p class="legal-disclaimer">General information only — not legal advice. AI processing is used; don't share confidential documents or ID numbers.</p>
    </div>`;
}

function parseOAuthReturn() {
  const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
  if (hash.has("error_description")) {
    toast(hash.get("error_description") || "Sign-in was cancelled. Please try again.", "error");
    history.replaceState({}, "", `${location.pathname}${location.search}`);
    return;
  }
  const access = hash.get("access_token");
  const refresh = hash.get("refresh_token");
  if (!access || !refresh) return;
  const expiresIn = Number(hash.get("expires_in") || 3600);
  storeSession({
    access_token: access, refresh_token: refresh,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user: null,
  });
  history.replaceState({}, "", `${location.pathname}${location.search}`);
}

function currentRoute() {
  return pathData();
}

async function render() {
  if (state.pageBusy) {
    state.renderPending = true;
    return;
  }
  state.pageBusy = true;
  parseOAuthReturn();
  const { path, portal, loginRole } = currentRoute();
  try {
    if (path === "/") app.innerHTML = homePage();
    else if (path === "/join") app.innerHTML = joinPage();
    else if (path === "/reset-password") app.innerHTML = resetPasswordPage();
    else if (loginRole) {
      state.session = await currentSession();
      if (state.session?.user && loginRole !== "admin") {
        const profile = await loadProfile(loginRole, state.session.user.id);
        const actualRole = profile.base?.primary_role;
        const destination = ["athlete", "sports", "lawyer"].includes(actualRole) ? actualRole : loginRole;
        history.replaceState({}, "", `/${destination}`);
        state.renderPending = true;
        return;
      }
      state.authMode = state.authMode || "signin";
      app.innerHTML = authPage(loginRole);
    } else if (portal) await renderPortal(portal.role, portal.section);
    else if (path === "/blog" || path.startsWith("/blog/")) app.innerHTML = await blogPage(path);
    else if (publicPages[path]) {
      const page = publicPages[path];
      const content = page.sections ? prose(page.sections) : empty("Nothing published yet", "Our editorial team will publish research, explainers and stories here.");
      const image = page.image === "runner" ? `<img src="https://mehfoozmaidan.lovable.app/__l5e/assets-v1/46a015dc-5933-45ca-b9af-d49f951f3863/runner.png" alt="Young athlete sprinting on an athletics track" style="width:100%;aspect-ratio:21/9;object-fit:cover;border-radius:1.4rem;margin-bottom:3rem" loading="lazy" />` : "";
      app.innerHTML = pageShell({ ...page, content: image + content });
    } else if (path === "/how-it-works") {
      const steps = [
        ["Register by role", "Choose athlete, sports professional or organisation, or lawyer. Each has its own registration flow and dashboard."],
        ["Get verified", "Submit the relevant credentials. Our team records every approval, so a verified badge always means a real review took place."],
        ["Connect & discover", "Search permitted profiles, send connection requests, and control exactly who can find and contact you."],
        ["Recruit & apply", "Organisations publish opportunities and manage pipelines from invitation to trial, offer and outcome."],
        ["Get legal support", "Request help from verified lawyers, draft agreements in Contract Studio and track real lawyer review."],
      ];
      app.innerHTML = pageShell({ eyebrow: "How it works", title: "Five steps to a fairer game.", intro: "One platform, three distinct experiences — each with its own permissions and tools.",
        content: `<ol class="step-list">${steps.map(([title, description], index) => `<li class="step"><span class="number">0${index + 1}</span><h2>${title}</h2><p>${description}</p></li>`).join("")}</ol>` });
    } else if (path === "/opportunities") {
      app.innerHTML = pageShell({ eyebrow: "Opportunities", title: "Open doors, verified sources.", intro: "Only approved organisations can publish opportunities here.",
        content: empty("No opportunities published yet", "When verified boards, clubs and academies publish trials or roles, they will appear here.", anchor("/join", "Join as an organisation", 'class="button"')) });
    } else {
      app.innerHTML = `${pageHeader()}<main id="main" class="container page-shell">${empty("Page not found", "The page you're looking for doesn't exist or has been moved.", anchor("/", "Go home", 'class="button"'))}</main>${footer()}`;
    }
  } catch (error) {
    app.innerHTML = `${pageHeader()}<main id="main" class="container page-shell">${empty("This page didn't load", error.message || "Something went wrong. You can try again or head back home.", `<button class="button" data-action="retry-page">Try again</button>`)}</main>${footer()}`;
  } finally {
    state.pageBusy = false;
    document.title = path === "/" ? "Mehfooz Maidan — Protected ground for Pakistani sport" : `${titleCase(path.split("/").filter(Boolean).at(-1) || "Home")} — Mehfooz Maidan`;
    if (state.renderPending) {
      state.renderPending = false;
      render();
    }
  }
}

function navigate(path) {
  history.pushState({}, "", path);
  state.mobileMenu = false;
  state.mobileSidebar = false;
  state.activeConversation = "";
  if (!path.includes("/contracts")) state.activeContract = "";
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function signIn(role, data) {
  if (role === "admin") {
    const result = await fetch("/api/admin/login", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: data.password }),
    });
    const body = await result.json();
    if (!result.ok) throw new Error(body.error || "Admin sign-in failed.");
    const credentials = await authRequest("/auth/v1/token?grant_type=password", { email: body.email, password: data.password });
    storeSession({ ...credentials, expires_at: Math.floor(Date.now() / 1000) + Number(credentials.expires_in || 3600) });
    navigate("/admin");
    return;
  }
  if (state.authMode === "reset") {
    await loadConfig();
    await authRequest(`/auth/v1/recover?redirect_to=${encodeURIComponent(`${location.origin}/reset-password`)}`, { email: data.email });
    toast("If that email is registered, a reset link is on its way.", "success");
    state.authMode = "signin";
    app.innerHTML = authPage(role);
    return;
  }
  if (state.authMode === "signup") {
    await loadConfig();
    const url = `/auth/v1/signup?redirect_to=${encodeURIComponent(`${location.origin}/${role}/login`)}`;
    await authRequest(url, {
      email: data.email, password: data.password,
      data: { role, full_name: data.full_name || "", kind: data.kind || "individual" },
    });
    toast("Check your email to verify your account, then sign in.", "success");
    state.authMode = "signin";
    app.innerHTML = authPage(role);
    return;
  }
  const result = await authRequest("/auth/v1/token?grant_type=password", { email: data.email, password: data.password });
  storeSession({ ...result, expires_at: Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600) });
  const profile = await loadProfile(role, result.user.id);
  const actualRole = profile.base?.primary_role;
  if (role !== "admin" && actualRole && actualRole !== role) {
    navigate(`/${actualRole}`);
    return;
  }
  navigate(role === "admin" ? "/admin" : `/${role}`);
}

async function logout() {
  const session = await currentSession();
  if (session?.access_token) {
    await authRequest("/auth/v1/logout", undefined, { token: session.access_token }).catch(() => {});
  }
  storeSession(null);
  state.assistantMessages = [];
  state.assistantConversationId = null;
  navigate("/");
}

async function submitProfile(form) {
  const role = form.dataset.role;
  const user = (await currentSession())?.user;
  if (!user?.id) throw new Error("Sign in again to save your profile.");
  const values = new FormData(form);
  const get = (key) => String(values.get(key) || "").trim();
  const base = { full_name: get("full_name"), region: get("region") || null, contact_open: values.get("contact_open") === "on" };
  let detail;
  if (role === "athlete") {
    detail = {
      sport: get("sport"), discipline: get("discipline"), level: get("level"), bio: get("bio"), goals: get("goals"),
      achievements: get("achievements"), statistics: get("statistics"), qualifications: get("qualifications"),
      visibility: get("visibility"), is_minor: values.get("is_minor") === "on",
      guardian_name: get("guardian_name") || null, guardian_email: get("guardian_email") || null,
    };
  } else if (role === "sports") {
    detail = { subtype: get("subtype"), org_name: get("org_name"), title: get("title"), sports: get("sports"), qualifications: get("qualifications"), bio: get("bio"), website: get("website") };
  } else {
    detail = { bar_enrollment: get("bar_enrollment"), jurisdiction: get("jurisdiction"), expertise: get("expertise"), experience_years: Number(get("experience_years") || 0), languages: get("languages"), bio: get("bio"), available: values.get("available") === "on" };
  }
  const submitMode = form.querySelector("[name=submit_mode]:focus")?.value || "save";
  if (submitMode === "submit") detail.status = "submitted";
  await Promise.all([
    dbRequest("profiles", { method: "PATCH", filters: { id: `eq.${user.id}` }, body: base }),
    dbRequest(profileTables[role], { method: "PATCH", filters: { user_id: `eq.${user.id}` }, body: detail }),
  ]);
  toast(submitMode === "submit" ? "Submitted for verification." : "Profile saved.", "success");
  render();
}

async function submitOpportunity(form) {
  const user = (await currentSession())?.user;
  const data = new FormData(form);
  const value = (key) => String(data.get(key) || "").trim();
  await dbRequest("opportunities", {
    method: "POST",
    body: {
      owner_id: user.id, title: value("title"), opp_type: value("opp_type"), sport: value("sport"), region: value("region"),
      description: value("description"), deadline: value("deadline") || null, status: data.get("publish") === "on" ? "published" : "draft",
    },
  });
  toast("Opportunity saved.", "success");
  render();
}

async function submitLegal(form) {
  const user = (await currentSession())?.user;
  const data = new FormData(form);
  await dbRequest("legal_requests", {
    method: "POST",
    body: {
      requester_id: user.id, category: data.get("category"), jurisdiction: data.get("jurisdiction"), summary: data.get("summary"),
      description: data.get("description"), language: data.get("language") || null, deadline: data.get("deadline") || null,
    },
  });
  toast("Request submitted to verified lawyers.", "success");
  render();
}

async function submitContract(form) {
  const user = (await currentSession())?.user;
  const data = new FormData(form);
  const result = await dbRequest("contracts", {
    method: "POST",
    body: {
      owner_id: user.id, title: data.get("title"), agreement_type: data.get("type"),
      involves_minor: data.get("minor") === "on", guardian_consent_confirmed: data.get("consent") === "on",
      parties: { first: data.get("p1"), second: data.get("p2") },
      answers: { term: data.get("term"), payment: data.get("payment"), duties: data.get("duties"), termination: data.get("termination"), other: data.get("other") },
    },
  });
  const created = Array.isArray(result) ? result[0] : result;
  state.activeContract = created?.id || "";
  toast("Agreement created.", "success");
  render();
}

async function submitAssistant(form) {
  const input = String(new FormData(form).get("message") || "").trim();
  if (!input || state.assistantBusy) return;
  state.assistantBusy = true;
  state.assistantMessages.push({ role: "user", content: input });
  render();
  try {
    const session = await currentSession();
    const response = await fetch(session ? "/api/assistant" : "/api/assistant/public", {
      method: "POST",
      headers: { "content-type": "application/json", ...(session ? { authorization: `Bearer ${session.access_token}` } : {}) },
      body: JSON.stringify(session ? { conversationId: state.assistantConversationId, message: input } : { messages: state.assistantMessages.slice(-10) }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "The assistant is unavailable.");
    if (body.conversationId) state.assistantConversationId = body.conversationId;
    state.assistantMessages.push({ role: "assistant", content: body.reply });
  } catch (error) {
    state.assistantMessages.push({ role: "assistant", content: error.message || "The assistant is unavailable right now." });
  } finally {
    state.assistantBusy = false;
    render();
    if (state.assistantOpen) document.querySelector(".assistant-dialog")?.scrollTo({ top: 100000, behavior: "smooth" });
    const messageBox = document.querySelector(".assistant-dialog textarea");
    if (state.assistantOpen) messageBox?.focus();
  }
}

document.addEventListener("click", async (event) => {
  const link = event.target.closest("a[data-nav]");
  if (link && link.origin === location.origin && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
    event.preventDefault();
    navigate(link.pathname + link.search + link.hash);
    return;
  }
  const element = event.target.closest("[data-action]");
  if (!element) return;
  const action = element.dataset.action;
  const id = element.dataset.id;
  try {
    if (action === "mobile-menu") { state.mobileMenu = !state.mobileMenu; render(); }
    else if (action === "sidebar-toggle") { state.mobileSidebar = !state.mobileSidebar; document.querySelector(".dashboard")?.classList.toggle("menu-open", state.mobileSidebar); }
    else if (action === "sidebar-close") { state.mobileSidebar = false; document.querySelector(".dashboard")?.classList.remove("menu-open"); }
    else if (action === "auth-mode") { state.authMode = element.dataset.mode; app.innerHTML = authPage(currentRoute().loginRole); }
    else if (action === "logout") await logout();
    else if (action === "retry-page") render();
    else if (action === "toggle-create-opportunity") {
      const form = document.querySelector("#create-opportunity");
      if (form) form.hidden = !form.hidden;
    } else if (action === "apply") {
      const message = prompt("Add a short message to the organiser (optional)") || "";
      const user = (await currentSession())?.user;
      await dbRequest("applications", { method: "POST", body: { opportunity_id: id, athlete_id: user.id, message: message.slice(0, 2000) } });
      toast("Application sent.", "success"); render();
    } else if (action === "application-stage") {
      await dbRequest("applications", { method: "PATCH", filters: { id: `eq.${id}` }, body: { stage: element.dataset.stage } });
      toast("Application updated.", "success"); render();
    } else if (action === "publish-opportunity") {
      const status = element.dataset.status || "published";
      await dbRequest("opportunities", { method: "PATCH", filters: { id: `eq.${id}` }, body: { status } });
      toast(`Opportunity ${status}.`, "success"); render();
    } else if (action === "discover-tab") { state.discoverTab = element.dataset.tab; render(); }
    else if (action === "connect") {
      const user = (await currentSession())?.user;
      await dbRequest("connections", { method: "POST", body: { requester_id: user.id, addressee_id: id } });
      toast("Connection request sent.", "success");
    } else if (action === "save-person") {
      const user = (await currentSession())?.user;
      await dbRequest("saved_profiles", { method: "POST", body: { user_id: user.id, saved_user_id: id }, prefer: "resolution=ignore-duplicates,return=minimal" });
      toast("Saved.", "success");
    } else if (action === "message-person") {
      const conversationId = await rpc("start_conversation", { _other: id });
      state.activeConversation = String(conversationId || "");
      navigate(`/${currentRoute().portal.role}/messages?c=${encodeURIComponent(conversationId)}`);
    } else if (action === "report-person") {
      const reason = prompt("Describe the concern. Safeguarding concerns are prioritised.");
      if (!reason || reason.trim().length < 3) return;
      const safeguarding = confirm("Is this a safeguarding concern involving a child or vulnerable person?");
      const user = (await currentSession())?.user;
      await dbRequest("reports", { method: "POST", body: { reporter_id: user.id, target_user_id: id, reason: reason.slice(0, 2000), category: safeguarding ? "safeguarding" : "other" } });
      toast("Report submitted to the moderation team.", "success");
    } else if (action === "open-conversation") {
      state.activeConversation = id; navigate(`${location.pathname}?c=${encodeURIComponent(id)}`);
    } else if (action === "accept-conversation" || action === "decline-conversation") {
      const user = (await currentSession())?.user;
      await dbRequest("conversation_participants", { method: "PATCH", filters: { conversation_id: `eq.${id}`, user_id: `eq.${user.id}` }, body: { accepted: action === "accept-conversation", last_read_at: new Date().toISOString() } });
      if (action === "decline-conversation") state.activeConversation = "";
      toast(action === "accept-conversation" ? "Request accepted." : "Request declined.", "success"); render();
    } else if (action === "accept-legal" || action === "decline-legal" || action === "close-legal") {
      const user = (await currentSession())?.user;
      const body = action === "accept-legal" ? { status: "accepted", lawyer_id: user.id }
        : action === "decline-legal" ? { status: "open" } : { status: element.dataset.status || "closed" };
      await dbRequest("legal_requests", { method: "PATCH", filters: { id: `eq.${id}` }, body });
      toast("Request updated.", "success"); render();
    } else if (action === "open-contract") {
      state.activeContract = id; render();
    } else if (action === "back-contracts") {
      state.activeContract = ""; history.replaceState({}, "", location.pathname); render();
    } else if (action === "draft-contract") {
      const session = await currentSession();
      const response = await fetch("/api/contracts/draft", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ contractId: id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create a draft.");
      toast("AI draft created.", "success"); render();
    } else if (action === "edit-version") {
      const body = document.querySelector("#contract-body")?.textContent || "";
      const text = prompt("Edit this agreement text. Saving creates a new version.", body);
      if (text === null) return;
      const user = (await currentSession())?.user;
      const versions = await dbRequest("contract_versions", { select: "version", filters: { contract_id: `eq.${state.activeContract}` }, order: "version.desc", limit: 1 });
      await dbRequest("contract_versions", { method: "POST", body: { contract_id: state.activeContract, version: (versions?.[0]?.version || 0) + 1, body: text, created_by: user.id, ai_generated: false, note: "Edited version" } });
      toast("Version saved.", "success"); render();
    } else if (action === "download-version") {
      const body = document.querySelector("#contract-body")?.textContent || "";
      const blob = new Blob([body], { type: "text/plain" });
      const download = document.createElement("a");
      download.href = URL.createObjectURL(blob); download.download = "agreement-draft.txt"; download.click(); URL.revokeObjectURL(download.href);
    } else if (action === "contract-status") {
      await dbRequest("contracts", { method: "PATCH", filters: { id: `eq.${id}` }, body: { status: element.dataset.status } });
      render();
    } else if (action === "share-contract") {
      toast("Choose a verified lawyer from the Discover page, then share the agreement from the contract review workflow.");
    } else if (action === "mark-read") {
      await dbRequest("notifications", { method: "PATCH", filters: { id: `eq.${id}` }, body: { read_at: new Date().toISOString() } });
      render();
    } else if (action === "verification-decision") {
      const note = prompt(`Optional note for ${element.dataset.status.replace("_", " ")}:`, "");
      if (note === null) return;
      const user = (await currentSession())?.user;
      const table = profileTables[element.dataset.role];
      await dbRequest(table, { method: "PATCH", filters: { user_id: `eq.${id}` }, body: { status: element.dataset.status } });
      await dbRequest("verification_decisions", {
        method: "POST",
        body: { user_id: id, reviewer_id: user.id, status: element.dataset.status, note: note || null },
      });
      toast("Decision recorded.", "success"); render();
    } else if (action === "report-status") {
      await dbRequest("reports", { method: "PATCH", filters: { id: `eq.${id}` }, body: { status: element.dataset.status } });
      toast("Report updated.", "success"); render();
    } else if (action === "suggestion-status") {
      await dbRequest("suggestions", { method: "PATCH", filters: { id: `eq.${id}` }, body: { status: element.dataset.status } });
      toast("Suggestion updated.", "success"); render();
    } else if (action === "assistant-toggle") {
      state.assistantOpen = !state.assistantOpen;
      document.querySelector(".assistant-dialog")?.classList.toggle("open", state.assistantOpen);
    } else if (action === "assistant-new") {
      state.assistantMessages = []; state.assistantConversationId = null; render();
    } else if (action === "assistant-suggestion") {
      const form = document.querySelector(".assistant-dialog form");
      const input = form?.elements.namedItem("message");
      if (input) { input.value = element.dataset.text; form.requestSubmit(); }
    } else if (action === "google-login") {
      const { createLovableAuth } = await import("/public/cloud-auth.js");
      const lovable = { auth: createLovableAuth() };
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${location.origin}/athlete/login`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      if (!result.tokens?.access_token || !result.tokens.refresh_token) throw new Error("Sign-in did not complete. Please try again.");
      const user = await authRequest("/auth/v1/user", undefined, { token: result.tokens.access_token, method: "GET" });
      storeSession({ ...result.tokens, user, expires_at: Math.floor(Date.now() / 1000) + 3600 });
      navigate("/athlete/login");
    }
  } catch (error) {
    toast(error.message || "That action could not be completed.", "error");
  }
});

document.addEventListener("input", (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  if (filter === "opportunities") state.opportunityQuery = event.target.value;
  if (filter === "opportunity-type") state.opportunityType = event.target.value;
  if (filter === "discover") state.discoverQuery = event.target.value;
  if (filter === "opportunities" || filter === "opportunity-type" || filter === "discover") {
    const cursor = event.target.selectionStart;
    render();
    const next = document.querySelector(`[data-filter="${filter}"]`);
    if (next) { next.focus(); if (cursor !== null) next.setSelectionRange(cursor, cursor); }
  } else if (filter === "conversation-search") {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll(".conversation-button").forEach((button) => {
      button.hidden = !button.textContent.toLowerCase().includes(query);
    });
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const type = form.dataset.form;
  try {
    if (type === "auth") {
      const data = Object.fromEntries(new FormData(form));
      await signIn(form.dataset.role, data);
    } else if (type === "password-reset") {
      const password = String(new FormData(form).get("password") || "");
      if (password.length < 8) throw new Error("Use at least 8 characters.");
      const session = await currentSession();
      if (!session) throw new Error("Open the password-reset link from your email first.");
      await authRequest("/auth/v1/user", { password }, { token: session.access_token, method: "PUT" });
      toast("Password updated.", "success"); navigate("/join");
    } else if (type === "profile") await submitProfile(form);
    else if (type === "settings") {
      const user = (await currentSession())?.user;
      const values = new FormData(form);
      await dbRequest("profiles", { method: "PATCH", filters: { id: `eq.${user.id}` }, body: { full_name: values.get("full_name"), region: values.get("region") || null, contact_open: values.get("contact_open") === "on" } });
      toast("Settings saved.", "success"); render();
    } else if (type === "opportunity") await submitOpportunity(form);
    else if (type === "application-note") {
      const notes = String(new FormData(form).get("notes") || "");
      await dbRequest("applications", { method: "PATCH", filters: { id: `eq.${form.dataset.id}` }, body: { notes: notes.slice(0, 4000) } });
      toast("Private note saved.", "success");
    } else if (type === "legal-request") await submitLegal(form);
    else if (type === "contract") await submitContract(form);
    else if (type === "contract-comment") {
      const user = (await currentSession())?.user;
      const body = String(new FormData(form).get("body") || "");
      await dbRequest("contract_comments", { method: "POST", body: { contract_id: form.dataset.id, author_id: user.id, body } });
      toast("Comment posted.", "success"); render();
    } else if (type === "message") {
      const user = (await currentSession())?.user;
      const values = new FormData(form);
      const body = String(values.get("body") || "").trim();
      if (!body) return;
      await dbRequest("messages", { method: "POST", body: { conversation_id: form.dataset.conversation, sender_id: user.id, body: body.slice(0, 5000) } });
      state.activeConversation = form.dataset.conversation; render();
    } else if (type === "assistant") await submitAssistant(form);
    else if (type === "suggestion") {
      const user = (await currentSession())?.user;
      const values = new FormData(form);
      const subject = String(values.get("subject") || "").trim();
      const body = String(values.get("body") || "").trim();
      const legalImpact = String(values.get("legal_impact") || "").trim();
      if (subject.length < 3 || body.length < 10) throw new Error("Add a subject (3+ characters) and a suggestion (10+ characters).");
      await dbRequest("suggestions", { method: "POST", body: { user_id: user.id, role: form.dataset.role, subject: subject.slice(0, 200), body: body.slice(0, 4000), legal_impact: legalImpact ? legalImpact.slice(0, 4000) : null } });
      toast("Thank you — your suggestion has been stored and the team will review it.", "success");
      render();
    }
  } catch (error) {
    toast(error.message || "Could not save your changes.", "error");
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.dataset.filter;
  if (filter === "opportunity-type") {
    state.opportunityType = event.target.value;
    render();
  }
});

window.addEventListener("popstate", () => {
  state.mobileMenu = false;
  state.mobileSidebar = false;
  render();
});

window.addEventListener("hashchange", () => {
  parseOAuthReturn();
  render();
});

// Render immediately. The public pages (including home) don't need /api/config;
// anything that does (auth, data) loads it on demand and shows its own error.
render();
