import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, CalendarClock, Clock3, FileText, HeartPulse, Landmark, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useQueueSocket } from '../hooks/useQueueSocket';
import { useQueueStore } from '../store/queueStore';
import { useLanguageStore } from '../store/languageStore';
import { minutesLabel, confidenceLabel } from '../utils/format';
import { api } from '../utils/api';

const fallbackPurposes = [
  { label: 'Doctor visit', icon: HeartPulse, hint: 'OPD, clinic, consultation' },
  { label: 'Lab test', icon: FileText, hint: 'Diagnostics or sample collection' },
  { label: 'Billing / payment', icon: Landmark, hint: 'Cash counter and receipts' },
  { label: 'Appointment follow-up', icon: CalendarClock, hint: 'Scheduled visit or review' }
];

export function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { joinQueue } = useQueueStore();
  const [queues, setQueues] = useState([]);
  const { t } = useLanguageStore();
  const [queueError, setQueueError] = useState('');
  const [token, setToken] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [form, setForm] = useState({ queueId: searchParams.get('queueId') || '', customerName: '', phone: '', purpose: '', joinType: 'qr' });

  const handleSnapshot = useCallback((nextSnapshot) => {
    setSnapshot(nextSnapshot);
    if (token?._id) {
      const found = [...(nextSnapshot.waiting || []), nextSnapshot.current, ...(nextSnapshot.recent || [])].filter(Boolean).find((item) => item._id === token._id);
      if (found) setToken(found);
    }
  }, [token?._id]);

  useQueueSocket(form.queueId || token?.queue, handleSnapshot);

  useEffect(() => {
    api.get('/queues')
      .then(({ data }) => {
        setQueues(data.queues);
        setQueueError('');
      })
      .catch(() => {
        setQueueError('Queue booking needs the backend and MongoDB running. Once staff creates queues, they will appear here.');
      });
  }, []);

  useEffect(() => {
    const tokenId = searchParams.get('token');
    if (tokenId) api.get(`/tokens/${tokenId}`).then(({ data }) => setToken(data.token)).catch(() => {});
  }, [searchParams]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (!form.queueId) {
        toast.error('Please select an available queue first');
        return;
      }
      const created = await joinQueue(form);
      setToken(created);
      setSearchParams({ token: created._id });
      toast.success(`Your token is ${created.tokenNumber}`);
    } catch (error) {
      toast.error(error.message || 'Could not join queue. Check that backend and MongoDB are running.');
    }
  };

  const progress = snapshot?.waitingCount ? Math.max(8, 100 - ((token?.etaMinutes || 0) / Math.max(1, snapshot.waitingCount * 10)) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#f6faf9] px-5 py-6 text-ink dark:bg-[#091318] dark:text-white">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-teal"><ArrowLeft className="h-5 w-5" /> {t('brand')}</Link>
        <LanguageSwitcher />
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <Smartphone className="mb-4 h-9 w-9 text-teal" />
          <h1 className="text-3xl font-extrabold">{t('userBooking')}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-300">{t('userBookingSub')}</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            <div>
              <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">{t('purpose')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(queues.length ? queues.map((queue) => ({
                  label: queue.name,
                  hint: queue.department?.name || 'Service queue',
                  queueId: queue._id,
                  icon: fallbackPurposes[queues.indexOf(queue) % fallbackPurposes.length].icon
                })) : fallbackPurposes).map(({ label, hint, queueId, icon: Icon }) => {
                  const selected = form.queueId === queueId || form.purpose === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`rounded-lg border p-4 text-left transition ${selected ? 'border-teal bg-calm text-teal' : 'border-slate-200 bg-white hover:border-teal/40 dark:border-white/10 dark:bg-white/10'}`}
                      onClick={() => setForm({ ...form, queueId: queueId || form.queueId, purpose: label })}
                    >
                      <Icon className="mb-3 h-6 w-6" />
                      <p className="font-extrabold">{label}</p>
                      <p className="mt-1 text-sm opacity-75">{hint}</p>
                    </button>
                  );
                })}
              </div>
              {!queues.length ? <p className="mt-2 text-sm text-coral">{queueError || 'Staff should create queues first. These are sample purposes for the UI.'}</p> : null}
            </div>
            <Input label={t('name')} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            <Input label={t('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Button className="w-full" disabled={!form.queueId}>{form.queueId ? t('bookQueue') : t('waitingQueues')}</Button>
          </form>
        </Card>

        <Card className="min-h-[420px]">
          {token ? (
            <div>
              <p className="text-sm font-bold text-teal">{t('liveToken')}</p>
              <p className="mt-3 text-6xl font-extrabold">{token.tokenNumber}</p>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-300">{token.status} · {minutesLabel(token.etaMinutes)} · {confidenceLabel(token.confidence)}</p>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>{t('queueProgress')}</span><span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-4 rounded-full bg-gradient-to-r from-teal to-mint" style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-calm p-5 text-teal">
                  <Clock3 className="mb-3 h-7 w-7" />
                  <p className="text-3xl font-extrabold">{minutesLabel(token.etaMinutes)}</p>
                  <p className="text-sm font-semibold">{t('estimatedWait')}</p>
                </div>
                <div className="grid place-items-center rounded-lg border border-slate-100 bg-white p-5">
                  <QRCodeCanvas value={`${window.location.origin}/track?token=${token._id}`} size={132} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-5xl font-extrabold text-teal">No line. No crowd.</p>
                <p className="mx-auto mt-4 max-w-md text-slate-500 dark:text-slate-300">Create a token and this page will keep itself updated with live Socket.io events.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
