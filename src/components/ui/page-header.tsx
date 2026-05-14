type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-oxford/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-tight text-oxford md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 md:w-auto">{action}</div> : null}
    </header>
  );
}
