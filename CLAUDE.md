# Vicelić Camping — project notes

A single-file marketing website for **Vicelić Camping**, a small family-run campsite in
**Lovište** on the **Pelješac** peninsula, Croatia. The design is modelled on the layout and
structure of nevio-camping.com (an original build — not a copy of their branding).

## File

- `Vicelic Camping.dc.html` — the whole site (a Design Component). Open it directly in a browser.
- `support.js` — DC runtime (auto-generated, never edit).
- `uploads/` — reference screenshots from nevio-camping.com used for layout direction.

It is authored as a DC: template in `<x-dc>`, logic in the `class Component extends DCLogic`
`<script data-dc-script>` block. Edit with the dc_* tools; prefer small str-replace edits.

## Architecture

- **Single page, client-side routing.** `state.page` switches between screens via `go(page)`;
  every screen is an `<sc-if>` block in the template (`isHome`, `isAbout`, `isAccommodations`,
  `isActivities`, `isPricing`, `isMap`, `isRequest`, `isContact`).
- **Left sidebar nav** on desktop (≥1024px), collapsible via `toggleSidebar` (`state.sidebarOpen`);
  when collapsed a floating reopen button shows (`showReopen`). On mobile (<1024px) it becomes a
  sticky topbar + full-screen overlay menu (`state.mobileOpen`).
- **Accommodations page** toggles between Mobile homes and Camping via `state.accTab` (`accTabs`).
- **Send a request page** is a booking form (`state.form`, honeypot field `company`, `onSubmit`
  shows a success state — there is no real backend; wire one up before launch).
- **Events link** in the nav points to https://visitorebic-croatia.hr (external, new tab).

## Languages

Four locales in the `copy` object: **hr** (default), **en**, **de**, **sl**. `state.locale`
switches them; chips in the sidebar / mobile menu set it. When adding or editing copy, update
**all four** locales or the page renders blank in the missing one.

## Visual system

- Palette (do not change without being asked): primary navy `#114B7C`, mid blue `#2E7CB8`,
  light-blue accent `#5BB0DE`, body text `#6B7280` / `#3a4a52`, banners use solid `#114B7C` or a
  `#2E7CB8→#114B7C` gradient. Backgrounds are **pure white** (`#ffffff`).
- **Cards and images have square corners** (no border-radius); cards carry a soft shadow
  `0 6px 22px -12px rgba(17,75,124,0.22)` to separate from the white page. Buttons/pills/chips and
  small icon tiles keep their rounding — only cards/images/section panels are square.
- Fonts: Plus Jakarta Sans (headings), Inter (body), Roboto Mono (eyebrows/labels). Inline styles
  only — no stylesheets/classes.
- Imagery is striped placeholders with `[ ... ]` mono labels; replace with real photos when available.

## Known placeholders / TODO before launch

- All **prices, the €40 cleaning fee, taxes and dates** on the Pricing page are sample values.
- **Phone, address, email** in the footer/contact are placeholders.
- The **Camp Map page** is intentionally blank (dashed placeholder) — drop in the real interactive
  map embed later.
- The **Send a request** form is front-end only — connect it to email/CRM.
- Replace `[ ... ]` image placeholders with real photography.
