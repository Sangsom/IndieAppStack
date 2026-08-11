# Sentry vs Firebase Crashlytics — real dashboard capture brief

**Status:** `complete` · **Production path:** `capture-or-source + privacy-redaction` · **Fake UI generation:** prohibited
**Source piece:** Sentry vs Firebase Crashlytics for Mobile Apps
**Placement:** After the existing conceptual comparison graphic and before “How much do Sentry and Firebase Crashlytics cost in 2026?”
**Final filename:** `sentry-vs-firebase-crashlytics-issue-dashboards.png`
**Final canvas:** 1600 × 1125 px, PNG, sRGB

## Purpose

Show the real issue-triage surface of each product so the comparison demonstrates the practical difference without claiming hands-on testing. The image should prove that both products organize failures into issues while making their different operating contexts visible.

## Required source captures

### 1. Sentry — Issues view

Capture the real **Issues** list, not a marketing mock-up and not an individual issue detail page.

- Use a Sentry Developer account, a vendor demo, or an official vendor image with written reuse permission.
- Light theme, desktop layout, 1440 × 900 viewport or larger; capture at 2× when available.
- Show 3–5 issue rows and the columns that communicate triage: issue title, status/trend, last seen, events, and affected users.
- Keep enough Sentry navigation visible to identify the product, but crop unrelated browser and account chrome.
- Use demo data or redact organization names, project names, URLs, assignee names, emails, repository names, tokens, and customer data.
- Do not recolour, recreate, or “clean up” the Sentry interface beyond cropping and privacy redaction.

Official reference found during sourcing:

- [Sentry Issue Stream UI Enhancements](https://sentry.io/changelog/issue-stream-ui-enhancements/) — contains a real 2025 Issues stream screenshot. The page footer states © Sentry, all rights reserved. Treat the image as a visual reference unless reuse permission or a defensible editorial-use review is documented.

Final source used:

- User-supplied Sentry Issues capture, 1897 × 980 px, captured Aug 11, 2026.
- Privacy edit: the workspace avatar, top project selector, and 10 visible issue-row project identifiers were covered with opaque neutral bars. The canvas was restored to the original 1897 × 980 dimensions after redaction.
- Validation: macOS Vision OCR recognized 113 text lines and found 0 case-insensitive `mapon` matches in the final file.
- Final file: `public/content-visuals/articles/sentry-issues-dashboard-redacted.png`.

### 2. Firebase Crashlytics — Issues table

Capture the real **Crashlytics dashboard Issues table**, not the generic Crashlytics illustration and not only the Release Monitoring chart.

- Use an owned Firebase project, a disposable demo project with a forced test crash, or official vendor material whose reuse terms cover the image.
- Light theme, desktop layout, 1440 × 900 viewport or larger; capture at 2× when available.
- Scroll so the Issues table is prominent. Show 3–5 issue rows plus enough Firebase/Crashlytics navigation to identify the product.
- Prefer rows that expose the prioritization context described in the article: issue, impact/events or users, version, status, and recency.
- Use demo data or redact project IDs, app identifiers, package names, bundle IDs, user identifiers, stack paths, emails, and customer data.
- Do not recolour, recreate, or merge UI elements from different Firebase screens.

Official references found during sourcing:

- [Firebase Crashlytics documentation](https://firebase.google.com/docs/crashlytics) describes the Issues table and issue grouping.
- [Firebase Crashlytics codelab](https://firebase.google.com/codelabs/understand-unity-games-crashes-using-advanced-crashlytics) contains real interface screenshots and is licensed under CC BY 4.0 unless otherwise noted. One filtered dashboard capture includes the Issues table and is now packaged for the article; the event-summary and logs captures are used as supporting evidence.
- [Release Monitoring documentation](https://firebase.google.com/docs/release/release-monitoring) contains a CC BY 4.0 example chart. It is not a substitute for the requested Issues table.

## Google Images sourcing results

Google Images was used for discovery only. Google advises checking the license on the original host even when the **Usage rights** filter is applied; appearing in search results does not grant reuse rights.

### Cleared for reuse with attribution

- [Firebase Crashlytics event-summary screenshot](https://firebase.google.com/static/codelabs/understand-unity-games-crashes-using-advanced-crashlytics/img/40c96abe7f90c3aa.png) — real Crashlytics UI from the [official Firebase codelab](https://firebase.google.com/codelabs/understand-unity-games-crashes-using-advanced-crashlytics). The page states that its content is licensed under CC BY 4.0 unless otherwise noted. It is suitable as an issue-detail visual, but it is not the directly comparable Issues-table capture requested for the final composite.
- [Firebase Crashlytics non-fatal filter screenshot](https://firebase.google.com/static/codelabs/understand-unity-games-crashes-using-advanced-crashlytics/img/a39ea8d9944cbbd9.png) — real Crashlytics UI from the same CC BY 4.0 codelab. It includes the dashboard filter state and an Issues table, so it is the cleared Crashlytics-side source for the article.
- [Firebase Crashlytics logs screenshot](https://firebase.google.com/static/codelabs/understand-unity-games-crashes-using-advanced-crashlytics/img/4e27aa407b7571cf.png) — real Crashlytics UI from the same CC BY 4.0 codelab. Useful for an issue-context section, not the main side-by-side comparison.

Suggested attribution: “Firebase Crashlytics interface, Google Firebase Codelabs, licensed under CC BY 4.0.” Link both the codelab and the license from the image caption or article source note.

### Accurate reference, but not openly licensed

- [Sentry Issues stream screenshot](https://cslswue7zohm4cat.public.blob.vercel-storage.com/tL4PFCI-image.png) — official, current-looking product UI from [Sentry’s Issue Stream UI Enhancements changelog](https://sentry.io/changelog/issue-stream-ui-enhancements/). The source page says “© 2026 Sentry. All rights reserved” and provides no reuse license. Use only after written permission or an editorial-use review; otherwise capture an owned/demo Sentry account instead.

### Rejected Google results

- Medium, personal-blog, tutorial, and agency-hosted Sentry screenshots were rejected because no clear reuse license was attached to the original image pages.
- Generic Firebase Crashlytics illustrations and Release Monitoring charts were rejected for the comparison slot because they do not show the Issues workflow.

**Publication-safe path completed:** use the cleared Crashlytics Issues-table screenshot with CC BY attribution, followed immediately by the user-supplied Sentry Issues capture with organization/project identifiers redacted.

## Final composition after both captures exist

- 1600 × 1125 px, with 64 px outer margin and a 32 px gutter.
- Two equal 720 × 865 px panels, Sentry on the left and Firebase Crashlytics on the right.
- Crop each UI to the issue-list area and preserve a comparable information density. Do not stretch.
- Add plain-text labels above each panel: **Sentry Issues** and **Firebase Crashlytics Issues**.
- Use IndieAppStack framing only outside the vendor captures:
  - paper background `#fbfaf7`;
  - white panels `#ffffff`;
  - ink labels `#20241f`;
  - pine divider/accent `#2c5f4f`;
  - rule `#e7e2d7`;
  - optional restrained gold `#9a6b23` for the “real UI · captured” caption.
- Type feel: Source Serif 4 for the small heading if available, Inter/system sans for labels. Do not imitate either vendor’s surrounding site chrome.
- Add a bottom caption: “Real product interfaces · captured/sourced Aug 2026 · organization identifiers redacted”.
- Do not add feature claims, prices, checkmarks, winner badges, or vendor logos outside the UI itself.

## Accessibility

**Alt text:** Sentry Issues and Firebase Crashlytics issue dashboards shown side by side, each listing recent errors with impact and triage information.

- Text labels outside the captures must meet WCAG AA contrast.
- UI text must remain legible at an 800 px rendered article width; if it does not, use 2–3 representative rows rather than shrinking the full dashboard.
- Do not use colour alone to identify the products; both panels have text labels.
- The caption must state that organization and project identifiers were redacted; do not describe the Sentry metrics as demo data.

## Rights and privacy checklist

- [x] Both source images are a user-supplied capture or have documented reuse licensing.
- [x] Trademarks are used only to identify the reviewed products; the placement does not imply endorsement.
- [x] Visible organization/project identifiers requested by the user are removed; OCR found 0 `mapon` matches.
- [x] Both product interfaces come from real captures. The only Sentry changes are opaque privacy redactions and canvas resampling.
- [x] Capture date and source are recorded in the article fact/asset ledger.
- [x] Firebase CC BY attribution appears beside each sourced screenshot and in the article sources.

## Completion gate

Complete. The Crashlytics side passes the rights and sourcing gate, and the supplied Sentry capture passes the requested privacy check. The article places the two Issues views consecutively, which fills the comparison placeholder without fabricating or reconstructing either interface. A 1600 × 1125 composite remains optional rather than required.
