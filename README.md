# next/font preload not emitted with multi-dot `pageExtensions`

Minimal reproduction for a Next.js issue: with a multi-dot `pageExtensions`
value such as `['page.tsx']` (documented as supported), `<link rel="preload"
as="font">` tags are not emitted, while CSS and JS preload tags for the same
route are emitted correctly.

## Reproduce

```bash
pnpm install
pnpm build
pnpm start
```

In another terminal:

```bash
curl -s http://localhost:3000/ | grep -oE '<link[^>]*rel="preload"[^>]*>'
```

**Observed:** no `<link rel="preload" as="font">` tag is printed. Only the
script preload tag is present.

**Expected:** at least one font preload tag pointing to a `.woff2` file, as
happens on any default Next.js App Router project using `next/font`.

## Control (working case is on the `control` branch)

The [`control`](../../tree/control) branch has the same code but with
`pageExtensions` removed and files renamed back to `layout.tsx` /
`page.tsx`. Building it emits the font preload tag as expected.

```bash
git checkout control
pnpm build && pnpm start
curl -s http://localhost:3000/ | grep -oE '<link[^>]*rel="preload"[^>]*>'
# -> <link rel="preload" href="/_next/static/media/....woff2" as="font" ...>
```

To see the entire diff that toggles the bug on / off:

```bash
git diff main..control -- .
```

The diff is limited to `next.config.ts` and two file renames — no source
change — which isolates the trigger to the multi-dot `pageExtensions`
mechanism.

## Notes

- Docs page describing multi-dot `pageExtensions`:
  <https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions>
- The affected file resolves manifest keys with
  `filePath.replace(/\.[^.]+$/, '')`, which strips exactly one extension
  segment. The font manifest (`next-font-manifest-plugin`) writes keys with
  all extensions stripped; the CSS/JS manifest (`flight-manifest-plugin`)
  writes keys with only the final extension stripped. The two formats
  diverge only when `pageExtensions` contains more than one dot.
