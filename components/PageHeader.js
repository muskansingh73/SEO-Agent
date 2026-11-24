export default function PageHeader({ title, description, demo = true }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-1.5 max-w-xl text-ink/65">{description}</p>
      </div>
      {demo && (
        <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink/60">
          Demo data
        </span>
      )}
    </div>
  );
}