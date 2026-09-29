# Kindergarten mobile enquiry v4 — preview only

Base: approved content `67da4ff`. Scope: mobile `/kindergarten`; no deployment or merge into main.

Three required fields: adult name, phone, institution name/number. Child count and comment optional. Explicit unchecked data-processing consent; existing legal URLs/versions retained. Hero, catalog, inline and sticky enquiry links open one controlled Radix dialog. Closing preserves the draft in memory, not persistent browser storage. Success requires both a successful HTTP response and the existing API's `{ok: true, leadId}`. While sending, a synchronous guard prevents double-click submissions. A failed/uncertain response retains the draft. No automatic retries. A later manual retry after network uncertainty can still duplicate a server-created lead; server-side idempotency remains a separate hardening task.

The chosen album is a calculation preference, not an order. It is included in `comment`, which the existing server already puts in the amoCRM lead note. Institution remains required on the frontend and server. Existing backend, CRM schema and desktop forms are unchanged. General hero enquiries do not silently claim that the default catalog selection is the client's choice.

## Commercial consistency

Owner clarification: the 10-page album includes a personalized 21x30 certificate; the 15x21 diploma is an optional 500 RUB item. Big History includes graduation photography; graduation video is 15,000 RUB, not 50% off. History discount is 20% on photo/video separately or together after album prepayment. The existing minimum of 15 History albums is deliberately retained pending a separate owner decision to remove it. Reels is not discounted. Prices and common descriptions are centralized in `albumCommercial.ts` and reused in catalog rows and FAQ. The 10% album promotion now explicitly requires full payment of the confirmed order by 2026-10-01 inclusive. Layout of desktop is not redesigned, but authorized commercial text changes also affect shared school/desktop views.

## Checks

Node tests validate payloads against the actual unchanged lead server using a local fake CRM. Browser tests intercept all /api/leads submissions and block live CRM/analytics. Screenshots are production-preview captures. Small-height viewports only simulate reduced keyboard space, not a physical iPhone keyboard. Physical-device QA, actual authorized CRM submission and video availability remain release checks. Old commercial files in Project knowledge and external CRM/document templates must be replaced explicitly; repository changes do not rewrite them.
