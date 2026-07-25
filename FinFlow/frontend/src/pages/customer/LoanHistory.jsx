import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusTimeline from '../../components/loan/StatusTimeline';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '';

export default function LoanHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get('/loans/my-applications');
        setApplications(data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load your loan history');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#08111f_50%,_#03060d_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Loan History</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Track every application</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Follow each application from submission through disbursement.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/6 p-8 text-center text-slate-300 backdrop-blur">
              Loading your applications...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-8 text-rose-100 backdrop-blur">
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/6 p-8 text-center text-slate-300 backdrop-blur">
              You haven&apos;t applied for a loan yet.{' '}
              <Link to="/loan-products" className="font-medium text-cyan-200 hover:text-cyan-100">
                Browse loan products
              </Link>{' '}
              to get started.
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{app.loanProduct?.name || 'Loan product'}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatCurrency(app.requestedAmount)} · {app.tenureMonths} months · Applied{' '}
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <StatusTimeline status={app.status} />
                </div>

                {app.status === 'rejected' && app.remarks && (
                  <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                    {app.remarks}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}