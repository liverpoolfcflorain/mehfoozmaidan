<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The Mehfooz Maidan UI is the original vanilla JS app in `src/legacy/app.js`, mounted by `LegacyApp` from the `/` and `/$` routes; it talks to the database directly and to `/api/*` server routes (`src/server/*.server.ts`). Why: preserves the migrated app's behaviour without a rewrite.
- Verification certificates are issued by a database trigger when a profile becomes approved and rendered as PDF by `/api/certificate` (pdf-lib). Why: proof exists only for admin-approved profiles.
