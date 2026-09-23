# Mobile catalog v2 — preview only

Scope: replace only the mobile catalog on `/kindergarten` below 768 CSS px. Base: approved preview `1dcc98f1c02b74ce9f8e2fcd86b4edb9c9c8f202`. Keep the approved hero, desktop, school pages, commercial configuration and CRM unchanged. No merge or deployment without the owner's separate approval.

## Interface

Five named tabs (Папка, Трио, 6, 10, 14 страниц), one changing card. The 10-page package stays selected initially. Price, preview, shooting days, three relevant differences and the order minimum stay visible. Full details, comparison, video and a larger image open in a modal bottom sheet. Closing restores focus without changing the selected format or scrolling the catalog. No autoplay of formats; no fixed/clipped card height. Tabs wrap on small screens or with large text. Radix handles keyboard tabs, focus trapping, Escape and modal scroll lock. Local panel styles do not affect shared dialogs.

Prices/full package contents are sourced directly from `albumPackages`; the short bullets are presentation-only summaries. Promotional discounts are not calculated or introduced here. Existing commercial discrepancies with product document v1.3 (diploma/certificate and graduation discounts) remain a separate pre-publication review, not silently reconciled in this UI change.

## Verification

`check-kindergarten-catalog-v2.py` runs against the candidate and the approved v1 preview. It checks every format, dialogs, keyboard switching, return focus/scroll, 200% text, UTM-preserving CTA, approved hero regression and unchanged desktop/school layouts. Chromium covers the full set; WebKit covers touch-like mobile interactions. WebKit emulation is not a physical iPhone test. Requests to live analytics/CRM are blocked; no forms are submitted.

The GitHub workflow builds both versions, compares TypeScript diagnostics, and uploads screenshots/report. Existing TypeScript diagnostics are compared to baseline, not suppressed by a blanket successful exit. Screenshots of isolated catalog blocks hide fixed/sticky navigation solely to avoid occluding the inspected block. Normal viewport and panel screenshots retain UI overlays. This workflow does not deploy.
