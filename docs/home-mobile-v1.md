# Mobile home v1

Base: 85fc9dfacfea41e8440ffbd53b337f19ad6706f1. Preview for owner review; no production rollout.

Only the home route opts into the new presentation below 768px. Desktop preserves the existing component markup and content. Mobile gets a compact hero, two product choices, a product selector, native scrolling photo-day cards, collapsed advantages, the existing mobile review rail, native scrolling process steps, four initial FAQ items and a consultation dialog using the existing CTA submission handler. Prices, contractual conditions and all existing photos/reviews remain available.

Validation: Vite production build, TypeScript check and diff whitespace check passed. Browser widths 320, 375, 390, 430 and 767 have no document overflow. At 768 the desktop presentation returns. At identical 1440px widths the visible home section text, width and height match the public 85fc9df release exactly. Product switching, gallery arrows, process switching and consultation dialog fields/close were checked. No real CRM submission was made. Physical-device testing remains separate.

The local review frame is a temporary preview helper and is not part of the release.
