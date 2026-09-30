# Kindergarten mobile enquiry v4 — preview only

Base: approved content `67da4ff`. Scope: mobile `/kindergarten`; no deployment or merge into main.

Three required fields: adult name, phone, institution name/number. Child count and comment optional. Explicit unchecked data-processing consent; existing legal URLs/versions retained. Hero, catalog, inline and sticky enquiry links open one controlled Radix dialog. Closing preserves the draft in memory, not persistent browser storage. Success requires both a successful HTTP response and the existing API's `{ok: true, leadId}`. While sending, a synchronous guard prevents double-click submissions. A failed/uncertain response retains the draft. No automatic retries. A later manual retry after network uncertainty can still duplicate a server-created lead; server-side idempotency remains a separate hardening task.

The chosen album is a calculation preference, not an order. It is included in `comment`, which the existing server already puts in the amoCRM lead note. Institution remains required on the frontend and server. Existing backend, CRM schema and desktop forms are unchanged. General hero enquiries do not silently claim that the default catalog selection is the client's choice.

## Commercial consistency

Owner clarification: the 10-page album includes a personalized 21x30 certificate; the 15x21 diploma is an optional 500 RUB item. Big History includes graduation photography; graduation video is 15,000 RUB, not 50% off. History discount is 20% on photo/video separately or together after album prepayment. On 2026-09-30 the owner explicitly removed the separate 15-History-album threshold. A confirmed History album order and its contractual prepayment are still necessary; general minimum orders and mixed-order rules are not waived. Reels is not discounted. Prices and common descriptions are centralized in `albumCommercial.ts` and reused in catalog rows and FAQ. The 10% album promotion explicitly requires full payment of the confirmed order by 2026-10-01 inclusive. Layout of desktop is not redesigned, but authorized commercial text changes also affect shared school/desktop views.

## Checks and visual preview

Node tests validate payloads against the actual unchanged lead server using a local fake CRM. Commercial tests verify the absence of the removed threshold, retained prepayment and unchanged prices. Browser tests intercept all /api/leads submissions and block live CRM/analytics. Screenshots are production-preview captures. Small-height viewports only simulate reduced keyboard space, not a physical iPhone keyboard. Physical-device QA, actual authorized CRM submission and video availability remain release checks. Old commercial files in Project knowledge and external CRM/document templates must be replaced explicitly; repository changes do not rewrite them.

`scripts/capture-mobile-site.py` captures every distinct route at 390x844 CSS px for a scrollable visual phone review. `/school` is an alias of `/school/9-11`. Only kindergarten has the new mobile interface; other routes are included for context, not claimed to be modernized. Full-page captures temporarily hide floating bottom shortcuts so they do not obscure the continuous image; regular viewport captures retain them. The exported image viewer is not a live website or a real enquiry form. This workflow never deploys.
