type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-oxford">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
    </section>
  );
}
