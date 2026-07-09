# Security Notes

## Secret Rotation

The Naver API key that was pasted during development must be treated as exposed.

Before using Naver search again:

1. Open Naver Developers.
2. Delete or regenerate the exposed Client Secret.
3. Copy the new Client ID and Client Secret into `.env.local` only, preferably through `scripts/set-naver-env.ps1`.
4. Do not paste secrets into chat, documentation, screenshots, issues, or source files.

`.env.local` is intentionally ignored by git. If you share this project as a zip file, remove `.env.local` first.

If a secret was pasted into this chat, treat that specific value as exposed and rotate it again before real production use.

## Local Server Exposure

Default development mode binds to `127.0.0.1`.

Use LAN mode only for short mobile testing on a trusted Wi-Fi network:

```powershell
powershell -ExecutionPolicy Bypass -File ./start-dev.ps1 -Lan
```

Do not expose the Vite dev server or the Naver place proxy directly to the public internet.

## Release Gate

Before any external release:

- Run lint, typecheck, tests, and production build.
- Run a dependency audit.
- Rotate any key that was ever pasted into chat or shared files.
- Keep the baseline CSP in `index.html` active unless a stricter server-side policy replaces it.
- Keep operator/admin screens disabled in public builds unless `VITE_ENABLE_ADMIN=true` is intentionally set for a protected internal build.
- Add real authentication before exposing operator/admin screens.
- Move shared data from `localStorage` to an authenticated backend.
- Use GitHub for source control and CI, not as the primary service database. See `docs/ops-architecture.md`.
