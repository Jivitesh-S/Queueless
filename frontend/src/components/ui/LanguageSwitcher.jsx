import { languages, useLanguageStore } from '../../store/languageStore';

export function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className={`inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/10 ${className}`}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          className={`min-h-10 rounded-md px-3 text-sm font-extrabold transition ${
            language === item.code ? 'bg-teal text-white' : 'text-slate-600 hover:bg-calm hover:text-teal dark:text-slate-200'
          }`}
          onClick={() => setLanguage(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
