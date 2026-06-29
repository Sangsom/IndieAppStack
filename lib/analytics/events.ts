export const analyticsEvents = {
  affiliate_link_clicked: {
    description: "Visitor clicks through to an affiliate partner.",
    goal: true,
  },
  affiliate_link_created: {
    description: "Admin creates an affiliate redirect link.",
    goal: false,
  },
  article_read: {
    description: "Visitor reaches a meaningful article-read milestone.",
    goal: false,
  },
  article_drafted: {
    description: "Admin creates or saves an article draft.",
    goal: false,
  },
  article_published: {
    description: "Admin publishes a human-reviewed article.",
    goal: false,
  },
  cta_clicked: {
    description: "Visitor clicks a primary call to action.",
    goal: true,
  },
  newsletter_subscribed: {
    description: "Visitor submits the newsletter subscription form.",
    goal: true,
  },
  outbound_link_clicked: {
    description: "Visitor clicks a non-affiliate outbound link.",
    goal: false,
  },
  search_submitted: {
    description: "Visitor submits an onsite search query.",
    goal: false,
  },
  stack_recommendation_viewed: {
    description: "Visitor views a stack recommendation.",
    goal: false,
  },
  tool_created: {
    description: "Admin creates a tool record.",
    goal: false,
  },
  tool_updated: {
    description: "Admin updates a tool record.",
    goal: false,
  },
} as const;

export type AnalyticsEventName = keyof typeof analyticsEvents;

export type AnalyticsEventProperties = {
  affiliate_link_clicked: {
    affiliate_link_id?: string;
    location: string;
    tool_slug: string;
  };
  affiliate_link_created: {
    affiliate_link_id: string;
    affiliate_link_slug: string;
  };
  article_read: {
    article_slug: string;
    milestone: "started" | "halfway" | "completed";
  };
  article_drafted: {
    article_id: string;
    article_slug: string;
  };
  article_published: {
    article_id: string;
    article_slug: string;
  };
  cta_clicked: {
    href?: string;
    label: string;
    location: string;
  };
  newsletter_subscribed: {
    location: string;
  };
  outbound_link_clicked: {
    href: string;
    location: string;
  };
  search_submitted: {
    result_count?: number;
    search_location: string;
  };
  stack_recommendation_viewed: {
    stack_slug: string;
  };
  tool_created: {
    tool_id: string;
    tool_slug: string;
  };
  tool_updated: {
    tool_id: string;
    tool_slug: string;
    update_type: "archive" | "save";
  };
};

export type AnalyticsPropertyValue = boolean | number | string;
