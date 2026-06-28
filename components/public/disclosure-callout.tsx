import { Callout } from "@/components/ui/callout";

type DisclosureCalloutProps = {
  children: React.ReactNode;
  title?: string;
};

export function DisclosureCallout({
  children,
  title = "Disclosure",
}: DisclosureCalloutProps) {
  return (
    <Callout title={title} variant="disclosure">
      {children}
    </Callout>
  );
}
