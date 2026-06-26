# CLAUDE.md

Guidance for AI-assisted development of the camp website. Read this before generating or editing any code.

## Project

A bilingual (HR/EN) multipage marketing website for a camp. Goal: guide visitors from arrival → showcase → inquiry. No booking system — every CTA funnels to a contact/inquiry form that emails the owner.

**Pages:** Home, About Us, FAQ, Contact Us.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling (design tokens below)
- **next-intl** for i18n (`/hr` default, `/en`)
- **Leaflet** + OpenStreetMap for maps (no API key)
- **Resend** (or Formspree fallback) for form → email
- Deploy on **Vercel**

Do not add a database, CMS, or auth. Keep it static-first.

## Design system

Modern, editorial, green + white. No cursive fonts.

### Colors (Tailwind tokens)
```
deep:    #1B4332   // dark forest, headers/footer
primary: #2D6A4F   // primary green
accent:  #52B788   // buttons, highlights
offwhite:#F8F9F7   // section background separation
white:   #FFFFFF
ink:     #1A1A1A   // primary text
muted:   #6B7280   // secondary text
```

### Typography
- Headings: **Plus Jakarta Sans**
- Body: **Inter**
- Load via `next/font/google`. Strong size hierarchy, generous line-height, lots of whitespace.

### Visual language
- Mobile-first, fully responsive. Hamburger nav under `md` (768px).
- Rounded corners (`rounded-2xl`), soft shadows, large imagery via `next/image`.
- Subtle fade-in / slide-up on scroll. Smooth, restrained motion — premium not flashy.
- Touch-friendly galleries and tap targets.

## i18n rules

- Default locale: **HR**. Routes: `/hr/...` and `/en/...`.
- Language toggle in header swaps locale, preserves current page.
- ALL user-facing copy lives in `messages/hr.json` and `messages/en.json`. Never hardcode display text in components.
- Keep key structure identical across both files.
- Bilingual SEO: localized `<title>`, meta description, and `hreflang` tags per page.

## Page specs

### Home (the showcase)
Sections in order: Hero (image/video + tagline + "Inquire/Upit" CTA) → Camp intro → Accommodation highlights (grid/carousel: photo, capacity, amenities, price-from) → Facilities (icon grid) → Things to do at camp → Explore the area (Leaflet map with markers + distances) → Gallery → Reviews/testimonials → closing CTA to Contact.

### About Us / O nama
Story, setting, what makes the camp different, team/grounds photos. Optional simple timeline.

### FAQ / Česta pitanja
Accordion. Topics: check-in/out, pets, pricing, what to bring, parking, Wi-Fi, cancellation, nearby amenities.

### Contact Us / Kontakt
Conversion point. Inquiry form: name, email, dates (optional), party size, message. Plus phone, email, address, embedded Leaflet map, reception hours, socials.

## Form / inquiry behavior

- No booking system, no Booking.com link.
- Every "Book" CTA reads **"Inquire / Pošalji upit"** and points to the Contact form.
- Form submits via a Next.js API route using Resend → emails the owner. Formspree as fallback.
- Show success + error states. Add spam protection (honeypot field, optionally hCaptcha).
- No data stored server-side.

## Suggested structure
```
app/
  [locale]/
    layout.tsx          // header + footer shell, fonts, i18n provider
    page.tsx            // Home
    about/page.tsx
    faq/page.tsx
    contact/page.tsx
  api/
    inquiry/route.ts    // Resend email handler
components/
  layout/ Header.tsx Footer.tsx LangToggle.tsx
  home/   Hero.tsx Accommodation.tsx Facilities.tsx ThingsToDo.tsx AreaMap.tsx Gallery.tsx Reviews.tsx
  ui/     Button.tsx Section.tsx Accordion.tsx
  forms/  InquiryForm.tsx
messages/
  hr.json
  en.json
i18n/ config + routing
public/ images
tailwind.config.ts
```

## Build order

1. Scaffold + Tailwind + design tokens + fonts
2. Layout shell (header w/ lang toggle, footer) + next-intl wiring
3. Home sections
4. About, FAQ, Contact pages
5. Inquiry form + Resend email integration
6. Responsive pass + scroll animations + bilingual SEO/meta

## Conventions

- TypeScript strict. Functional components.
- Tailwind utilities over custom CSS; use the design tokens, no arbitrary hex values in components.
- Reusable `Section` and `Button` primitives — don't repeat layout/spacing.
- Accessible: semantic HTML, alt text on all images, keyboard-navigable nav/accordion/form, sufficient contrast.
- Optimize images (`next/image`, correct sizes, lazy load below the fold).
- Keep components small and composable.
