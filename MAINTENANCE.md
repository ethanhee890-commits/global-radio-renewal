# Maintenance Plan

## Current Direction

The project is moving from a local MVP to a safer service foundation. The safest path is incremental modularization, not a full rewrite.

## Refactoring Order

1. Keep shared validation and security-sensitive helpers in `src/lib`.
2. Split `src/App.tsx` by route surface:
   - app shell/navigation
   - `FeedPage`
   - `DealDetailPage`
   - `SubmitPage`
   - `AdvertiserPage`
   - `AdminPage`
3. Split admin into smaller editors:
   - deals
   - merchants
   - submissions
   - dashboard
4. Split `src/styles.css` into:
   - tokens
   - base
   - components
   - pages
5. Add tests whenever logic moves out of React components.

## Release Rules

- Default dev servers must bind to `127.0.0.1`.
- LAN mode must be explicit and short-lived.
- Secrets must stay in `.env.local` only.
- No active public release before admin authentication and backend storage exist.
- Every change should pass `npm run verify`.

## Completed Foundation Work

- Validation helpers moved to `src/lib/validation.ts`.
- Shared form inputs moved to `src/components/FormFields.tsx`.
- Shared select control moved to `src/components/SelectControl.tsx`.
- App shell header, navigation, toast, and footer moved to `src/components/AppShell.tsx`.
- Naver place picker moved to `src/components/NaverPlacePicker.tsx`.
- Route and admin-surface gating helpers moved to `src/lib/navigation.ts`.
- Naver place URL validation distinguishes exact place URLs from search URLs.
- External purchase/reservation links are restricted to `http` and `https`.
- Naver local search proxy defaults to localhost and has basic rate limiting.
- `index.html` includes a baseline Content Security Policy for static deployments.
- Security scan script added.
- GitHub/backend role split documented in `docs/ops-architecture.md`.
