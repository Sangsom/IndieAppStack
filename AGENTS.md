<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Use the Notion CLI instead of the Notion MCP.
- When content is approved to go live, commit, push to main, and publish. Pushing main alone does not update live copy; production still needs a database seed (`npm run db:seed` locally is not enough either).
- After content is merged for go-live, provide the Google Search Console inspect or request-indexing link(s) for the affected URL(s).
- Fee-arithmetic and multi-path decision guides should include diagrams or other visuals, not tables alone.

## Learned Workspace Facts

- IndieAppStack (indieappstack.com) is a Next.js field guide for solo and indie mobile developers, mainly iOS: tool pages, comparisons, guides, category hubs, and a Stack Finder.
- Guides are published at `/guides/<slug>`. There is no `/blog` route. Comparisons are `/comparisons/<slug>`, tools are `/tools/<slug>`, and category hubs are `/categories/<slug>`.
- Live copy is seeded by `scripts/seed-database.mjs` (`npm run db:seed`). Tool page bodies live in `scripts/tool-content.json`. Guide and comparison drafts live under `output/indieappstack/<slug>/` and only become live after they are wired into the seed and the production database is seeded.
- Article diagrams and SVGs live under `public/content-visuals/articles/`.
- Category hub UI can ship in app code on deploy, but category metadata and tool page bodies still come from the seeded database.
- Brand voice is calm and plain-spoken: no contractions, no superlative claims, no fake hands-on testing, Oxford comma, no emoji, and an institutional IndieAppStack byline. The profile is `.dm-hub/indieappstack/brand-profile.md`.
- Content Calendar tasks run through `.claude/rd-web/bin/rd-web`. Finish content work at Review until the user asks to publish, and do not change Notion status outside that CLI.
- Affiliate CTAs use internal `/go/<slug>` redirects with disclosure before the link.
