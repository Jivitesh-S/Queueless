export function Input({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base outline-none ring-teal/20 transition focus:ring-4 dark:border-white/10 dark:bg-white/10"
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-coral">{error}</span> : null}
    </label>
  );
}
