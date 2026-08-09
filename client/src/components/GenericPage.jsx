export function GenericPage({ title }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">FreshCart</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          This section is scaffolded for the next phase and already has the route, layout, and styling hooks in place.
        </p>
      </div>
    </div>
  );
}