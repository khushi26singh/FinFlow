import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const STATUS_STYLES = {
  pending: { label: 'Pending', badge: 'border-slate-300/30 bg-slate-400/10 text-slate-200' },
  under_review: { label: 'Under Review', badge: 'border-amber-300/30 bg-amber-400/10 text-amber-100' },
  approved: { label: 'Approved', badge: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100' },
  rejected: { label: 'Rejected', badge: 'border-rose-300/30 bg-rose-400/10 text-rose-100' },
};

const CREDIT_STATUS_STYLES = {
  Excellent: 'text-emerald-200',
  Good: 'text-emerald-200',
  Fair: 'text-amber-200',
  Poor: 'text-rose-200',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [creditProfile, setCreditProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [applicationsResult, creditResult, productsResult] = await Promise.allSettled([
        API.get('/loans/my-applications'),
        API.get('/credit/my-score'),
        API.get('/loan-products'),
      ]);

      const nextErrors = {};

      if (applicationsResult.status === 'fulfilled') {
        setApplications(applicationsResult.value.data.data || []);
      } else {
        nextErrors.applications = 'Failed to load your applications';
      }

      if (creditResult.status === 'fulfilled') {
        setCreditProfile(creditResult.value.data.data || null);
      } else {
        nextErrors.credit = 'Failed to load your credit profile';
      }

      if (productsResult.status === 'fulfilled') {
        setProducts(productsResult.value.data.data || []);
      } else {
        nextErrors.products = 'Failed to load loan products';
      }

      setErrors(nextErrors);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const approvedCount = applications.filter((app) => app.status === 'approved').length;
  const pendingCount = applications.filter((app) => ['pending', 'under_review'].includes(app.status)).length;
  const latestApplication = applications[0];

  const handleApplyForProduct = (product) => {
    navigate('/apply-loan', { state: { productId: product._id } });
  };

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#08111f_55%,_#04070d_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">FinFlow Customer Hub</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Good morning, {firstName} 👋</h1>
            <p className="mt-2 text-sm text-slate-300">
              Role: <span className="font-medium text-cyan-200 capitalize">{user?.role}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/loan-products"
              className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Browse Loan Products
            </Link>
            <Link
              to="/apply-loan"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Apply for a Loan
            </Link>
            <Link
              to="/emi-calculator"
              className="rounded-full border border-indigo-300/30 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/30"
            >
              EMI Calculator
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5 shadow-lg shadow-cyan-950/30">
            <h3 className="text-sm font-medium text-cyan-100/80">Credit Score</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
              {loading ? '—' : creditProfile?.score ?? '—'}
            </p>
            <p className={`mt-2 text-sm ${CREDIT_STATUS_STYLES[creditProfile?.status] || 'text-cyan-50/70'}`}>
              {errors.credit
                ? errors.credit
                : creditProfile?.status
                ? `${creditProfile.status} · ${creditProfile.riskCategory} risk`
                : 'Loading your profile...'}
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 shadow-lg shadow-emerald-950/20">
            <h3 className="text-sm font-medium text-emerald-100/80">Loan Applications</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{loading ? '—' : applications.length}</p>
            <p className="mt-2 text-sm text-emerald-50/70">Your total applications so far.</p>
          </div>
          <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 shadow-lg shadow-amber-950/20">
            <h3 className="text-sm font-medium text-amber-100/80">Approved</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{loading ? '—' : approvedCount}</p>
            <p className="mt-2 text-sm text-amber-50/70">Loans that have been approved.</p>
          </div>
          <div className="rounded-3xl border border-violet-300/20 bg-violet-400/10 p-5 shadow-lg shadow-violet-950/20">
            <h3 className="text-sm font-medium text-violet-100/80">Pending</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{loading ? '—' : pendingCount}</p>
            <p className="mt-2 text-sm text-violet-50/70">Waiting for the next review step.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Loan Status</h2>
                <p className="mt-1 text-sm text-slate-300">Track where each of your applications stands.</p>
              </div>
              <Link to="/loan-history" className="text-sm font-medium text-cyan-200 hover:text-cyan-100">
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {errors.applications ? (
                <p className="text-sm text-rose-300">{errors.applications}</p>
              ) : loading ? (
                <p className="text-sm text-slate-400">Loading applications...</p>
              ) : applications.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                  You haven&apos;t applied for a loan yet.{' '}
                  <Link to="/loan-products" className="font-medium text-cyan-200 hover:text-cyan-100">
                    Browse products
                  </Link>{' '}
                  to get started.
                </div>
              ) : (
                applications.slice(0, 4).map((app) => {
                  const style = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
                  return (
                    <div
                      key={app._id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{app.loanProduct?.name || 'Loan product'}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatCurrency(app.requestedAmount)} · {app.tenureMonths} months
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Eligibility Status</h2>
            <p className="mt-1 text-sm text-slate-300">
              {latestApplication ? 'Based on your most recent application.' : 'Apply for a loan to see your breakdown.'}
            </p>

            <div className="mt-5 space-y-2">
              {loading ? (
                <p className="text-sm text-slate-400">Loading...</p>
              ) : !latestApplication ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                  No applications yet — nothing to evaluate.
                </div>
              ) : (
                (latestApplication.eligibility?.checks || []).map((check) => (
                  <div
                    key={check.rule}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"
                  >
                    <span className="text-sm text-slate-200">{check.label}</span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        check.passed ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'
                      }`}
                    >
                      {check.passed ? '✓' : '✕'}
                    </span>
                  </div>
                ))
              )}
              {latestApplication && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    latestApplication.eligibility?.isEligible ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  Overall: {latestApplication.eligibility?.isEligible ? 'Eligible' : 'Not eligible'}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Available Loans</h2>
                <p className="mt-1 text-sm text-slate-300">Browse products before starting an application.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/emi-calculator" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                  Calculate EMI
                </Link>
                <Link to="/loan-products" className="text-sm font-medium text-cyan-200 hover:text-cyan-100">
                  View all
                </Link>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {errors.products ? (
                <p className="text-sm text-rose-300">{errors.products}</p>
              ) : loading ? (
                <p className="text-sm text-slate-400">Loading products...</p>
              ) : (
                products.slice(0, 4).map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleApplyForProduct(product)}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left transition hover:border-cyan-300/30 hover:bg-slate-950/60"
                  >
                    <p className="text-sm text-slate-300">{product.name}</p>
                    <p className="mt-2 text-2xl font-semibold">{product.interestRate}%</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Up to {formatCurrency(product.maxAmount)} · {product.tenureMonths} months
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              {errors.applications ? (
                <p className="text-sm text-rose-300">{errors.applications}</p>
              ) : loading ? (
                <p className="text-sm text-slate-400">Loading activity...</p>
              ) : applications.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                  No recent activity yet.
                </div>
              ) : (
                applications.slice(0, 3).map((app) => {
                  const style = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
                  return (
                    <div key={app._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <p className="text-sm font-medium text-white">
                        {app.loanProduct?.name || 'Loan product'} application {style.label.toLowerCase()}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatCurrency(app.requestedAmount)} on {formatDate(app.createdAt)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}