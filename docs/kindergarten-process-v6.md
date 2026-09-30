# Mobile process carousel — preview only

Base: spacing and selector preview `f467b9994555374b75ceca4083e743875bb2eda2`. The owner now explicitly requested swipeable process cards on mobile. This changes the earlier presentation decision (six cards in a vertical list), not the requirement to retain all six steps, descriptions, timings and sequence.

Only mobile `/kindergarten` opts in. `Process.tsx` and its exported `albumSteps` remain unchanged and are the content source for the new renderer. Desktop, school and photoday processes remain unchanged. The new renderer shows every step name in numbered navigation, one full card, previous/next arrows and a step counter. It supports native horizontal scrolling, keyboard navigation and reduced motion, has no autoplay and no fixed/clipped card height. Native scrolling remains vertical for the surrounding page. The reading-area controller also covers the process so floating shortcuts do not compete with its controls; the bottom enquiry action remains available.

The v5 spacing and album-selector changes are retained. No prices, forms, server, images, production publication, merge or force push. Preview screenshots and browser checks do not substitute for a physical-device/keyboard test or an authorized real CRM submission. The release checklist from earlier packages still applies.
