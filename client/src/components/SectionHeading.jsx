export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-4xl font-semibold text-brand-900 sm:text-5xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-[#61705f] sm:text-base">{description}</p> : null}
    </div>
  );
}