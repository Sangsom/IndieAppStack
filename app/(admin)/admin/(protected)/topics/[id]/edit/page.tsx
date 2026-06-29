import Link from "next/link";
import { notFound } from "next/navigation";

import { updateTopic } from "../../actions";
import { AdminTopicForm } from "@/components/admin/admin-topic-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminTopicEditor, getAdminTopicOptions } from "@/lib/admin-topics";

type EditAdminTopicPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminTopicPage({
  params,
}: EditAdminTopicPageProps) {
  const { id } = await params;
  const [topic, options] = await Promise.all([
    getAdminTopicEditor(id),
    getAdminTopicOptions(),
  ]);

  if (!topic) {
    notFound();
  }

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
      description="Move a topic through the queue. Drafting statuses require intent, and rejected topics retain feedback."
      eyebrow="Topic queue"
      title={`Edit ${topic.title}`}
    >
      <AdminTopicForm
        action={updateTopic}
        categories={options.categories}
        submitLabel="Save topic"
        tools={options.tools}
        topic={topic}
      />
    </AdminPageShell>
  );
}
