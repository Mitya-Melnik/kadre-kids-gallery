# Mobile layouts and hero benefits v10

Base: 09d2757fd6de2e3a534aa9c7d2677a3c822f470f. Work only in feature/mobile-layouts-benefits-v10. No merge or deployment. Preserve main and both backup branches.

Owner asked for exactly three changes:
1. Use the compact school-style layout selector on mobile kindergarten: twelve original design names, one selected cover, a bottom sheet with swipeable originals. Original desktop layout grid remains. The manifest lists all existing numbered WebP examples and is checked against public/layouts by the asset test. No nonexistent-file probing. Public assets are not altered.
2. Decorative, semantically matched emoji in mobile school hero benefits instead of four identical checks: portrait, camera, gift, document. Text and order stay unchanged. Desktop schools keep original markup.
3. Omit the entire real-project case only from mobile kindergarten. Remove its now-dangling footer shortcut only there. Keep ordinary gallery, reviews, full process, catalog, order rules, and enquiry. Desktop retains the case and shortcut.

The existing MobileSwipeRail supplies gestures, keyboard, arrows and a counter. No autoplay and no forced text clipping. The original kindergarten desktop list supplies design names. Focus/scroll return after closing the sheet. Original-image links remain available.

QA: frozen v9 reference; no commercial-text exceptions needed. Build, 13 prior Node tests plus 3 scoped tests, mobile Chromium/WebKit widths and text enlargement, all designs/images, modal controls, preserved desktop pages. Real submissions and analytics are blocked. Physical-device testing is still separate.
