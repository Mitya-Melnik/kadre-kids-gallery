# Mobile content v3 — isolated preview

Base: the owner's approved hero and catalog at `99ecb343f68685b2bc0f033e31587c8e7478b77e`. Work branch: `feature/kindergarten-mobile-content-v3`, based on `feature/kindergarten-mobile-v1`, not a deployment branch. No merge or deployment is authorised.

## Scope and explicit exclusions

- Only `/kindergarten` below 768 CSS px opts into the new presentation.
- Catalogue follows the hero and existing promotional strip. Photography examples follow the catalogue.
- Existing photo data and responsive image renderer are reused, without new or modified photographs. Three category filters, native horizontal scrolling, previous/next controls, counter, and a separate accessible larger viewer replace three long mobile rows.
- The six detailed advantages remain available under a disclosure rather than repeating six mandatory cards before prices. The four approved hero benefits remain visible.
- Two existing reviews (IDs 7 and 2) appear first; all other existing reviews remain available. Names, quotes and metadata are not rewritten, invented or presented as newly verified testimonials.
- Four existing questions appear first: contents, portrait choice, absence, delivery timing. All other questions and their existing audience-specific answers remain accessible. This is a presentation change, not reconciliation of commercial terms.
- **Process is not shortened, merged or collapsed. All six original steps, descriptions and timings stay visible. Its source and styling are unchanged.** This supersedes the earlier audit's four-step suggestion.
- Approved hero/catalog, desktop appearance/order, school routes, price configuration, commercial policy, lead form, server and CRM are not changed.

## Implementation

One responsive page order, keyed fragments (no duplicated IDs/DOM copies). Shared components opt in via `compactMobile`, default false. Mobile components receive original data/renderers rather than keeping parallel commercial data. All new CSS is limited to the mobile breakpoint and dedicated names. The gallery uses native scroll snapping and manual navigation, not autoplay.

## QA and remaining tasks

CI compares the real production builds at the approved baseline and candidate. Existing catalogue tests cover the hero, catalogue, desktop/school regressions, enlarged text and UTM. Additional tests verify the full unchanged process; original review, FAQ and gallery data; mobile order; disclosures; all 14 photos; large view, keyboard/close, and new components at 200% text.

Requests to live analytics and CRM are blocked and no lead is submitted. WebKit is an emulator, not a physical iPhone. Isolated block screenshots hide fixed/sticky page navigation solely for unobstructed inspection; ordinary viewport screenshots do not.

Outstanding commercial discrepancies, catalogue video availability, physical-device testing and a future short-form project remain outside this package. Existing testimonials are reused as source content, not independently authenticated in this UI task. Visual approval of this new package and separate permission to publish are still required.
