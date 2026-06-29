import Link from "next/link";

import { createTopic } from "../actions";
import { AdminTopicForm } from "@/components/admin/admin-topic-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminTopicOptions } from "@/lib/admin-topics";

export default async function NewAdminTopicPage() {
  const { categories, tools } = await getAdminTopicOptions();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/topics"
        >
          Back to topics
        </Link>
      }
      description="Create a controlled input for future AI drafting. Only briefed topics with clear intent should feed automation."
      eyebrow="Topic queue"
      title="New topic"
    >
      <AdminTopicForm
        action={createTopic}
        categories={categories}
        submitLabel="Save topic"
        tools={tools}
      />
    </AdminPageShell>
  );
}
