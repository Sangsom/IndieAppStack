import { Callout } from "@/components/ui/callout";

type DisclosureCalloutProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function DisclosureCallout({
  children,
  className,
  title = "Disclosure",
}: DisclosureCalloutProps) {
  return (
    <Callout className={className} title={title} variant="disclosure">
      {children}
    </Callout>
  );
}
