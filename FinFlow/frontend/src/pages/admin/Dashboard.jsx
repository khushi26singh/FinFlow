import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#22d3ee', '#34d399', '#f59e0b', '#f87171', '#a78bfa', '#60a5fa'];

const STATUS_LABELS = {
  approved: 'Approved',
  pending: 'Pending',
  under_review: 'Under Review',
  rejected: 'Rejected',
  agreement: 'Agreement',
  disbursed: 'Disbursed',
};

const statCardBase = 'rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/loans/applications/stats');
        setStats(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const statusBreakdown = stats?.statusBreakdown || [];
    const total = statusBreakdown.reduce((sum, item) => sum + (item.count || 0), 0);
    const approved = statusBreakdown
      .filter((item) => ['approved', 'agreement', 'disbursed'].includes(String(item._id).toLowerCase()))
      .reduce((sum, item) => sum + (item.count || 0), 0);
    const pending = statusBreakdown
      .filter((item) => ['pending', 'under_review'].includes(String(item._id).toLowerCase()))
      .reduce((sum, item) => sum + (item.count || 0), 0);
    const rejected = statusBreakdown
      .filter((item) => String(item._id).toLowerCase() === 'rejected')
      .reduce((sum, item) => sum + (item.count || 0), 0);

    return {
      total,
      approved,
      pending,
      rejected,
      pieData: statusBreakdown.map((item) => ({
        name: STATUS_LABELS[String(item._id).toLowerCase()] || item._id,
        value: item.count || 0,
      })),
      productDistribution: (stats?.productDistribution || []).map((item) => ({
        name: item.name,
        count: item.count || 0,
        totalAmount: item.totalAmount || 0,
      })),
    };
  }, [stats]);

  if (loading) {
    return <div className={statCardBase}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={`${statCardBase} border-rose-400/20 bg-rose-500/10 text-rose-100`}>{error}</div>;
  }

  const statCards = [
    { label: 'Total', value: summary.total, tone: 'text-cyan-200' },
    { label: 'Approved', value: summary.approved, tone: 'text-emerald-200' },
    { label: 'Pending', value: summary.pending, tone: 'text-amber-200' },
    { label: 'Rejected', value: summary.rejected, tone: 'text-rose-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Overview</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              User Management
            </Link>
            <Link
              to="/admin/applications"
              className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
            >
              View All Applications
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className={statCardBase}>
            <p className="text-sm text-slate-300">{card.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={statCardBase}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Status Breakdown</h2>
            <p className="text-sm text-slate-300">Applications by current workflow state</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={60}>
                  {summary.pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={statCardBase}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Loan Distribution by Product</h2>
            <p className="text-sm text-slate-300">Count of applications per product</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.productDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#22d3ee" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}