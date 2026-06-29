# AI Draft Webhook

Endpoint: `POST /api/ai/drafts`

The webhook creates editorial drafts only. It cannot publish content, and all accepted drafts are stored with `ai_assisted = true`, `human_reviewed = false`, and `published_at = null`.

## Authentication

Set `AI_DRAFT_WEBHOOK_SECRET` in Vercel for Production and Preview.

Clients may authenticate with either header:

```http
Authorization: Bearer <AI_DRAFT_WEBHOOK_SECRET>
```

or:

```http
x-ai-signature: sha256=<hmac_sha256_of_raw_request_body>
```

Unsigned or invalid requests return `401`. If the server secret is missing, the endpoint returns `503` so misconfiguration is visible.

## Payload

Required fields:

- `title`
- `slug`
- `body_markdown`

Optional fields:

- `status`: `draft` or `review`; defaults to `review`
- `content_type`: `guide`, `comparison`, `tool_review`, `category_page`, `stack_finder`, or `news`; defaults to `guide`
- `subtitle`
- `excerpt`
- `seo_title`
- `seo_description`
- `author`
- `primary_category_id`
- `topic_id`
- `related_tool_ids`
- `affiliate_cta_blocks`

`status=published` is rejected. Drafts must still pass the admin human-review publish gate before they can go public.

Example:

```json
{
  "title": "Best Analytics Stack for Indie Apps",
  "slug": "best-analytics-stack-for-indie-apps",
  "status": "review",
  "content_type": "guide",
  "body_markdown": "# Best Analytics Stack for Indie Apps\n\nDraft content...",
  "seo_title": "Best Analytics Stack for Indie Apps",
  "seo_description": "A practical guide to analytics tools for indie app builders.",
  "related_tool_ids": []
}
```

## Responses

- `201`: draft created
- `400`: malformed JSON or non-object payload
- `401`: missing/invalid auth
- `409`: article slug already exists
- `422`: schema validation failed
- `429`: rate limit exceeded
- `500`: storage or sync failure
