import { motion } from 'framer-motion';
import { ArrowRight, BellRing, Building2, CheckCircle2, Clock3, HeartPulse, MonitorUp, QrCode, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useLanguageStore } from '../store/languageStore';

const departments = [
  { name: 'General OPD', now: 'G-108', wait: '14 min', load: 72 },
  { name: 'Diagnostics', now: 'D-041', wait: '8 min', load: 48 },
  { name: 'Billing', now: 'B-214', wait: '21 min', load: 86 }
];

const features = [
  { title: 'Join without crowding the lobby', body: 'QR and desk-issued tokens give every visitor a clear place in line.', icon: QrCode },
  { title: 'Run counters with confidence', body: 'Call next, hold, skip, recall, and prioritize emergency tokens from one console.', icon: MonitorUp },
  { title: 'Show people what is happening', body: 'Large display boards and mobile tracking pages update in real time.', icon: BellRing },
  { title: 'Keep operations auditable', body: 'Wait times, no-shows, peak hours, and served volume are recorded automatically.', icon: ShieldCheck }
];

export function LandingPage() {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen bg-[#f4f8f7] text-ink">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-3 text-xl font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-mint"><HeartPulse className="h-6 w-6" /></span>
          {t('brand')}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <Link to="/user">{t('userBooking')}</Link>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageSwitcher />
          <Link to="/user"><Button variant="secondary">{t('userLogin')}</Button></Link>
          <Link to="/login"><Button>{t('staffLogin')} <ArrowRight className="h-5 w-5" /></Button></Link>
        </div>
      </header>

      <main>
        <section className="page-grid mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex w-fit items-center gap-2 rounded-lg border border-teal/15 bg-white px-4 py-2 text-sm font-bold text-teal shadow-sm">
              <Building2 className="h-4 w-4" />
              Built for clinics, banks, and service counters
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">
              {t('landingTitle')}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              {t('landingSub')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/user"><Button className="w-full sm:w-auto">{t('userBooking')}</Button></Link>
              <Link to="/login"><Button variant="secondary" className="w-full sm:w-auto">{t('staffLogin')}</Button></Link>
            </div>
            <LanguageSwitcher className="mt-5 sm:hidden" />
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
              {[
                ['5 sec', 'token issue'],
                ['Live', 'ETA updates'],
                ['Large', 'elder-friendly UI']
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold">{value}</p>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(18,33,42,0.14)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="rounded-lg bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-mint">CityCare public display</p>
                  <h2 className="mt-1 text-3xl font-extrabold">{t('nowServing')} G-108</h2>
                </div>
                <span className="rounded-lg bg-mint px-4 py-2 text-sm font-extrabold text-ink">Live</span>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['G-109', 'G-110', 'D-042', 'B-215'].map((token, index) => (
                  <div key={token} className="rounded-lg bg-white/10 p-4">
                    <p className="text-2xl font-extrabold">{token}</p>
                    <p className="mt-1 text-sm text-white/65">{(index + 1) * 6} min</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {departments.map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{item.name}</p>
                      <p className="mt-1 text-xl font-extrabold">Serving {item.now}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-teal">{item.wait}</p>
                      <p className="text-xs font-bold uppercase text-slate-400">avg wait</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-teal to-mint" style={{ width: `${item.load}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="workflow" className="border-y border-slate-200 bg-white py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3">
            {[
              ['1', 'Visitor joins', 'A QR scan or front-desk entry creates a token.'],
              ['2', 'Staff controls flow', 'Counters call, hold, skip, recall, or mark served.'],
              ['3', 'Everyone sees updates', 'Mobile pages, dashboards, and displays stay synchronized.']
            ].map(([number, title, body]) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-calm text-lg font-extrabold text-teal">{number}</span>
                <div>
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="mt-1 text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-extrabold">Designed for the messy middle of service operations</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Not just a ticket number. QueueLess handles interruptions, elderly visitors, urgent cases, counter changes, and the small moments that make queues stressful.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-teal" />
              Socket.io live sync included
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map(({ title, body, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="mb-5 h-8 w-8 text-teal" />
                <h3 className="text-xl font-extrabold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-lg bg-ink p-8 text-white sm:p-10">
            <Clock3 className="mb-5 h-9 w-9 text-mint" />
            <h2 className="max-w-3xl text-3xl font-extrabold">Start with better daily queue flow. Add prediction, branches, and integrations when the floor is ready.</h2>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/login"><Button>{t('staffLogin')}</Button></Link>
              <Link to="/user"><Button variant="secondary">{t('userBooking')}</Button></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
