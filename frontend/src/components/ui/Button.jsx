export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-teal text-white shadow-sm hover:bg-[#0b7a70]',
    secondary: 'bg-white text-ink border border-slate-200 hover:border-teal/40 hover:bg-calm/50 dark:bg-white/10 dark:text-white dark:border-white/10',
    danger: 'bg-coral text-white hover:bg-coral/90',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
  };

  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
