import Link from "next/link";

import { archiveCategory, ensureDefaultCategories } from "./actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import { getAdminCategoryList } from "@/lib/admin-categories";

type AdminCategoriesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  archive_failed: {
    tone: "error",
    text: "The category could not be archived.",
  },
  archived: {
    tone: "info",
    text: "Category archived and public pages revalidated.",
  },
  create_failed: {
    tone: "error",
    text: "The category could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Category created and public pages revalidated.",
  },
  defaults_seeded: {
    tone: "info",
    text: "PRD default categories are present.",
  },
  duplicate_slug: {
    tone: "error",
    text: "That slug is already used by another category.",
  },
  invalid_category: {
    tone: "error",
    text: "Check the category fields and try again.",
  },
  invalid_parent: {
    tone: "error",
    text: "A category cannot use itself as its parent.",
  },
  missing_category: {
    tone: "error",
    text: "The selected category could not be found.",
  },
  seed_failed: {
    tone: "error",
    text: "The default category list could not be created.",
  },
  update_failed: {
    tone: "error",
    text: "The category could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Category updated and public pages revalidated.",
  },
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-ink">
      {status}
    </span>
  );
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const categories = await getAdminCategoryList();

  return (
    <AdminPageShell
      actions={
        <>
          <form action={ensureDefaultCategories}>
            <button
              className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              type="submit"
            >
              Ensure PRD defaults
            </button>
          </form>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
            href="/admin/categories/new"
          >
            New category
          </Link>
        </>
      }
      description="Create, edit, archive, and order the taxonomy that powers category pages and public tool filters."
      eyebrow="Admin section"
      title="Categories"
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <AdminTable
        caption="Admin categories"
        columns={[
          {
            key: "category",
            label: "Category",
          },
          {
            key: "order",
            label: "Order",
          },
          {
            key: "parent",
            label: "Parent",
          },
          {
            key: "tools",
            label: "Tools",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Create the first category to power public filters and category pages."
        emptyTitle="No categories yet"
        rows={categories.map((category) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              {category.status === "published" ? (
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                  href={`/categories/${category.slug}`}
                >
                  View
                </Link>
              ) : null}
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/categories/${category.id}/edit`}
              >
                Edit
              </Link>
              <form action={archiveCategory}>
                <input name="category_id" type="hidden" value={category.id} />
                <input name="slug" type="hidden" value={category.slug} />
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-danger transition-colors hover:border-danger hover:bg-surface"
                  type="submit"
                >
                  Archive
                </button>
              </form>
            </div>
          ),
          category: (
            <div>
              <p className="font-semibold text-ink">{category.name}</p>
              <p className="mt-1 text-sm text-muted">/{category.slug}</p>
              {category.description ? (
                <p className="mt-2 max-w-md text-sm text-muted">
                  {category.description}
                </p>
              ) : null}
            </div>
          ),
          order: category.sort_order,
          parent: category.parentName ?? "None",
          status: <StatusBadge status={category.status} />,
          tools: category.toolCount,
        }))}
      />
    </AdminPageShell>
  );
}
