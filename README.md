# Control (font preload works)

This branch is the control for the `main` branch's reproduction. It uses the
default `pageExtensions` (no `pageExtensions` key set) and standard
`layout.tsx` / `page.tsx` filenames. Everything else — the `next/font/google`
import of Inter, the JSX — is identical to `main`.

## Verify

```bash
pnpm install
pnpm build
pnpm start
```

In another terminal:

```bash
curl -s http://localhost:3000/ | grep -oE '<link[^>]*rel="preload"[^>]*>'
```

You will see a `<link rel="preload" as="font"...>` tag pointing to Inter's
primary latin `.woff2` — the exact thing `main` is missing.

## Compare with `main`

```bash
git diff main..control -- .
```

The diff is limited to:
- `next.config.ts` — removes the `pageExtensions: ['page.tsx']` line
- `app/layout.page.tsx` → `app/layout.tsx` (rename only)
- `app/page.page.tsx` → `app/page.tsx` (rename only)

No source-code change, only file-name / config change. That isolates the
trigger to the multi-dot `pageExtensions` mechanism.
