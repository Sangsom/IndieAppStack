export type QuizOption = {
  description?: string;
  label: string;
  value: string;
};

type QuizStepProps = {
  description: string;
  legend: string;
  name: string;
  options: QuizOption[];
};

export function QuizStep({
  description,
  legend,
  name,
  options,
}: QuizStepProps) {
  return (
    <fieldset className="rounded-card border border-rule bg-surface p-5 shadow-field">
      <legend className="font-serif text-2xl font-semibold text-ink">
        {legend}
      </legend>
      <p className="mt-2 text-body-md text-muted">{description}</p>
      <div className="mt-5 grid gap-3">
        {options.map((option) => (
          <label
            className="grid cursor-pointer gap-1 rounded-card border border-rule bg-paper p-4 transition-colors hover:border-pine has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface has-[:checked]:border-pine has-[:checked]:bg-accent-soft"
            key={option.value}
          >
            <span className="flex items-center gap-3">
              <input
                className="size-4 accent-pine"
                name={name}
                type="radio"
                value={option.value}
              />
              <span className="font-semibold text-ink">{option.label}</span>
            </span>
            {option.description ? (
              <span className="pl-7 text-sm leading-6 text-muted">
                {option.description}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
