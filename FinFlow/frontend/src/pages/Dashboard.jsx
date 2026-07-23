import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const firstName = user?.name?.split(' ')[0] || 'there';

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
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
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
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">742</p>
            <p className="mt-2 text-sm text-cyan-50/70">Healthy profile and strong repayment potential.</p>
          </div>
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 shadow-lg shadow-emerald-950/20">
            <h3 className="text-sm font-medium text-emerald-100/80">Loan Applications</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">2</p>
            <p className="mt-2 text-sm text-emerald-50/70">Your active applications in progress.</p>
          </div>
          <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 shadow-lg shadow-amber-950/20">
            <h3 className="text-sm font-medium text-amber-100/80">Approved</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">1</p>
            <p className="mt-2 text-sm text-amber-50/70">One loan is already approved and ready.</p>
          </div>
          <div className="rounded-3xl border border-violet-300/20 bg-violet-400/10 p-5 shadow-lg shadow-violet-950/20">
            <h3 className="text-sm font-medium text-violet-100/80">Pending</h3>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">1</p>
            <p className="mt-2 text-sm text-violet-50/70">Waiting for the next review step.</p>
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
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm text-slate-300">Personal Loan</p>
                <p className="mt-2 text-2xl font-semibold">11.5%</p>
                <p className="mt-2 text-sm text-slate-400">Fast approvals for personal expenses.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm text-slate-300">Car Loan</p>
                <p className="mt-2 text-2xl font-semibold">8.75%</p>
                <p className="mt-2 text-sm text-slate-400">Competitive pricing for vehicle financing.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-medium text-white">Profile verified</p>
                <p className="mt-1 text-sm text-slate-400">Identity and contact details are up to date.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-medium text-white">Eligibility reviewed</p>
                <p className="mt-1 text-sm text-slate-400">Your profile is ready for the next application step.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}