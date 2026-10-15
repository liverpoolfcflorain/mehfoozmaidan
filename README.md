# Mehfooz Maidan

Mehfooz Maidan is a vanilla JavaScript, HTML and CSS application. It uses no frontend framework or CSS framework. The browser talks to the existing Supabase project through its public API and the Node server keeps privileged and AI credentials off the client.

## Run

Use Node.js 20 or newer:

```sh
npm run dev
```

The app listens on `PORT` (default `3000`). No package installation is needed.

## Server environment

Set these values with Replit Secrets or the environment that runs the app:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — needed for the protected administrator sign-in flow
- `ADMIN_PASSWORD` — administrator password checked only by the server
- `LOVABLE_API_KEY` — needed for the public/member assistant and contract drafting

The Supabase URL and publishable key are returned by `/api/config`; the service-role key, admin password and AI key are never sent to the browser.

## What is included

- Responsive public pages, blog, and role-specific sign-in/sign-up screens
- Athlete, sports-organisation, lawyer and administrator workspaces
- Profile editing, verification decisions, opportunities, applications, discovery, connections, messaging, legal requests, contract versions and notifications
- Server-only admin provisioning, AI chat and AI contract drafting endpoints

Supabase Row Level Security remains responsible for access to application data. The existing database migrations and Supabase configuration are retained.
