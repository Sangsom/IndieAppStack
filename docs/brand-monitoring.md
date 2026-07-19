# Brand Monitoring

Track where **IndieAppStack** and **indieappstack.com** get mentioned across the web so early
reputation signals — reviews, forum threads, blog write-ups, press — are caught and responded to
rather than missed.

- **Owner:** info@indieappstack.com
- **Primary tool:** Google Alerts (free, email or RSS delivery)
- **Success metric:** number of mentions detected and responded to per month (see the log at the
  bottom of this file)
- **Source:** dm-hub reputation task, set up Jul 19, 2026

Google Alerts is the zero-maintenance backbone, but it has real blind spots (Reddit, Hacker News,
X). Those are covered by the saved searches in the "Blind spots" section — check them monthly.

## What we track

| Term                | Why                                                                |
| ------------------- | ------------------------------------------------------------------ |
| `IndieAppStack`     | The brand name, one word (as written everywhere).                  |
| `Indie App Stack`   | The spaced variant people type when they have not seen it written. |
| `indieappstack.com` | Anyone citing or linking the domain by name.                       |

Every query below excludes our own site with `-site:indieappstack.com` so the alerts do not fire on
our own pages.

## Google Alerts — setup

Do this once, signed in to the Google account that should receive the alerts (see "Delivery" for the
account choice — it matters).

1. Go to <https://www.google.com/alerts>.
2. Paste the query into the "Create an alert about…" box.
3. Click **Show options** and set the fields per the table below.
4. Click **Create Alert**.
5. Repeat for the second alert.

### Alert 1 — brand name (both spellings)

```
"IndieAppStack" OR "Indie App Stack" -site:indieappstack.com
```

### Alert 2 — domain mentions

```
"indieappstack.com" -site:indieappstack.com
```

### Options for both alerts

| Field      | Value                | Why                                                                                                                                              |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| How often  | **As-it-happens**    | Mention volume is near zero today, so speed of response matters more than digest tidiness. Switch to "At most once a day" if it ever gets noisy. |
| Sources    | **Automatic**        | Let Google pull from News, Blogs, and Web rather than narrowing early.                                                                           |
| Language   | **Any Language**     | A mention in another language still counts, and translation is one click.                                                                        |
| Region     | **Any Region**       | Same reason — do not geo-limit a brand this small.                                                                                               |
| How many   | **All results**      | At low volume you want everything; "Only the best results" over-filters and hides long-tail mentions. Revisit once volume grows.                 |
| Deliver to | see "Delivery" below | —                                                                                                                                                |

If the combined `OR` query ever returns odd results, split Alert 1 into two separate alerts, one per
spelling — Google's boolean handling is occasionally flaky.

## Delivery

The **Deliver to** dropdown only offers the email of the Google account you are signed in as, plus
an **RSS feed** option. You cannot type an arbitrary address. So pick one of these:

- **Preferred — sign in as the brand mailbox.** If info@indieappstack.com is (or can be) a Google
  account, create the alerts while signed in there. Alerts then land directly in the shared inbox.
- **Forward from a personal Gmail.** Create the alerts under your usual Google account, then add a
  Gmail filter (from: `googlealerts-noreply@google.com`) that forwards or labels them, e.g. label
  `brand-mentions`, and optionally forwards to info@indieappstack.com.
- **RSS feed.** Choose "RSS feed" as the delivery target and keep the feed URL. This is the hook for
  later automation — the feed can be polled by a script or piped into Slack without any inbox.

Optional tidiness: on the alerts home page, click the gear (**Settings**) and turn on **Digest** to
bundle every alert into a single email at a set time each day.

## Blind spots — check monthly

Google Alerts routinely misses Reddit, Hacker News, and X, which is exactly where indie dev-tool
chatter happens. Bookmark these saved searches and skim them during the monthly reputation review.

| Source               | Saved search                                                                            |
| -------------------- | --------------------------------------------------------------------------------------- |
| Reddit (newest)      | <https://www.reddit.com/search/?q=IndieAppStack&sort=new>                               |
| Hacker News          | <https://hn.algolia.com/?q=IndieAppStack&sort=byDate&type=all>                          |
| X / Twitter (live)   | <https://x.com/search?q=IndieAppStack&f=live>                                           |
| Google, past month   | <https://www.google.com/search?q=%22IndieAppStack%22+-site:indieappstack.com&tbs=qdr:m> |
| Bing                 | <https://www.bing.com/search?q=%22IndieAppStack%22+-site%3Aindieappstack.com>           |
| Who links the domain | <https://www.google.com/search?q=%22indieappstack.com%22+-site:indieappstack.com>       |

## Response guidance

Reply in the brand voice — calm, plain-spoken, honest, no hype, no emoji (see
`.dm-hub/indieappstack/brand-profile.md`). Correct factual errors politely with a source; thank
genuine mentions; never argue or disparage a competitor. Disclose the affiliate relationship if a
monetized link comes up.

## Mention log

Log every mention here (or in the Notion project) so the monthly metric is real, not guessed.

| Date detected | Source | URL | Sentiment | Responded? | Notes |
| ------------- | ------ | --- | --------- | ---------- | ----- |
|               |        |     |           |            |       |

### Monthly rollup

| Month    | Detected | Responded | Notable                   |
| -------- | -------- | --------- | ------------------------- |
| Jul 2026 | 0        | 0         | Monitoring set up Jul 19. |
