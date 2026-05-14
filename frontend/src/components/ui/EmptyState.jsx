import { Inbox } from 'lucide-react';

export function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
      <Inbox className="mx-auto mb-3 h-8 w-8 text-teal" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{message}</p>
    </div>
  );
}
