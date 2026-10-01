# Mobile case spreads and reviews v7 — preview only

Base: 9d19bb421d9ae4298800785073f4038faa77ed72, approved by the owner except for two requested changes. Scope: `/kindergarten` below 768 CSS px only. No deployment, merge, change of commercial terms, or rewrite of the approved hero/catalog/process/form.

- The five original spreads in «История группы внутри альбома» are available in a native horizontal rail, without a Show More gate. The case hero, facts, «Съёмки в течение года» and other case copy remain unchanged. Enlarging a spread uses its original asset, preserves selection/scroll on close, and does not submit data.
- All existing reviews are in one swipeable rail. The previous two preferred reviews stay first; original names, descriptions and quotations are not rewritten. This UI change does not verify authenticity of pre-existing testimonials.
- Both rails have visible arrows, a count, keyboard support and no autoplay. Text grows naturally including at 200%. Prices, photographs, content arrays and API are not changed.
- Desktop retains its existing spread grid/Show More and reviews. Main, school pages, album selector and already approved mobile components remain unchanged.

Verification: production builds, existing Node tests, TypeScript baseline comparison, Chromium widths 320/360/390/430/767 and WebKit 390. New tests check all spreads/reviews against baseline content, real touch-like swipes, arrows, keyboard, zoom, return focus, 200% text, and desktop/school regression. Live analytics and submissions are blocked. Browser emulation does not replace a physical-device test. Screenshots and viewer are review artifacts, not a public deployment.
