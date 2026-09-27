# Stech Digital

The existing Stech Digital website: custom website design and development, supported by social media edits.

## Source of truth

Continue development in **https://github.com/seanpxxl/stechdigital**.

This repository contains the recovered website source, including the updated square hero artwork. The existing site is published at https://stech-digital.seanpxxl.chatgpt.site. A GitHub push does not automatically update that deployment; publishing is a separate step.

## Run locally

No package installation or build step is required. With Python 3 installed:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Stop the server with Ctrl+C.

## Edit the website

Despite its name, `dist/` contains the editable source, not generated framework output. Keep it in version control.

| File | Purpose |
| --- | --- |
| `dist/index.html` | Page sections, service copy, portfolio and contact links |
| `dist/assets/site.css` | Brand styling, responsive layouts and animation |
| `dist/assets/site.js` | Navigation, reveal effects and pointer interactions |
| `dist/assets/*.webp` | Original logo and compressed website artwork |
| `.openai/hosting.json` | Existing Sites project association and static directory |

Preserve the SD logo, magenta/violet/cyan palette and website-first positioning. Contact actions currently use Instagram **@stech.digital**. Add pricing, other contact channels or client claims only after they are confirmed. Portfolio examples remain labelled as demos/concepts.

## Before publishing

- Preview the page on mobile and desktop.
- Check navigation, Instagram links and FAQ controls.
- Check for clipping and horizontal scrolling.
- Respect reduced-motion preferences and keep imagery compressed.
- If Node.js is installed, validate JavaScript syntax with `node --check dist/assets/site.js`.

Keep credentials and local environment files out of Git. This repository does not enable GitHub Pages or change the existing site's domain.
