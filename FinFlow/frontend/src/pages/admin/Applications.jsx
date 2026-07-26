import { Fragment, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';

const STATUS_OPTIONS = ['all', 'pending', 'under_review', 'approved', 'agreement', 'disbursed', 'rejected'];

const NEXT_STATUS_ACTIONS = {
  pending: [
    { label: 'Move to Review', value: 'under_review', tone: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100' },
    { label: 'Reject', value: 'rejected', tone: 'border-rose-300/20 bg-rose-400/10 text-rose-100' },
  ],
  under_review: [
    { label: 'Approve', value: 'approved', tone: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100' },
    { label: 'Reject', value: 'rejected', tone: 'border-rose-300/20 bg-rose-400/10 text-rose-100' },
  ],
  approved: [
    { label: 'Mark Agreement Signed', value: 'agreement', tone: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100' },
    { label: 'Reject', value: 'rejected', tone: 'border-rose-300/20 bg-rose-400/10 text-rose-100' },
  ],
  agreement: [
    { label: 'Disburse', value: 'disbursed', tone: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100' },
    { label: 'Reject', value: 'rejected', tone: 'border-rose-300/20 bg-rose-400/10 text-rose-100' },
  ],
  disbursed: [],
  rejected: [],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value) =>
  value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';

const statusBadge = (status) => {
  const base = 'rounded-full border px-3 py-1 text-xs font-medium capitalize';
  switch (status) {
    case 'approved':
    case 'disbursed':
      return `${base} border-emerald-300/20 bg-emerald-400/10 text-emerald-100`;
    case 'rejected':
      return `${base} border-rose-300/20 bg-rose-400/10 text-rose-100`;
    case 'under_review':
      return `${base} border-amber-300/20 bg-amber-400/10 text-amber-100`;
    case 'agreement':
      return `${base} border-cyan-300/20 bg-cyan-400/10 text-cyan-100`;
    default:
      return `${base} border-slate-300/20 bg-slate-400/10 text-slate-100`;
  }
};

const statusLabel = (status) => status?.replaceAll('_', ' ') || '—';

const formatEligibilityValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'Passed' : 'Failed';
  }

  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }

  return String(value);
};

const CODESPACES_BACKEND_URL = 'https://silver-meme-wrrvjpj9j7vg397r7-5000.app.github.dev';

const getDocumentUrl = (filePath) => `${CODESPACES_BACKEND_URL}${filePath}`;

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (status !== 'all') params.set('status', status);

      const { data } = await API.get(`/loans/applications?${params.toString()}`);
      setApplications(data.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filteredCount = useMemo(() => applications.length, [applications]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      setSavingId(id);
      const { data } = await API.patch(`/loans/applications/${id}/status`, { status: nextStatus });
      setApplications((current) =>
        current.map((item) => {
          if (item._id !== id) {
            return item;
          }

          return data?.data || data || item;
        })
      );
      toast.success(`Application moved to ${nextStatus.replaceAll('_', ' ')}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingId('');
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Applications</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Loan Applications</h1>
            <p className="mt-2 text-sm text-slate-300">Search, filter, review, and advance application status.</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by applicant name"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:w-80"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-slate-900">
                  {option === 'all' ? 'All statuses' : option.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
            <button className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20">
              Search
            </button>
          </form>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100 backdrop-blur">{error}</div>}

      <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur">
        <div className="border-b border-white/10 px-5 py-4 text-sm text-slate-300">Showing {filteredCount} applications</div>

        {loading ? (
          <div className="p-6 text-slate-300">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-6 text-slate-300">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-950/25">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Applicant Name</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Loan Product</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Requested Amount</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Status</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {applications.map((app) => {
                  const actions = NEXT_STATUS_ACTIONS[app.status] || [];
                  const isExpanded = Boolean(expandedRows[app._id]);

                  return (
                    <Fragment key={app._id}>
                      <tr
                        onClick={() => toggleRow(app._id)}
                        className="cursor-pointer bg-white/0 transition hover:bg-white/5"
                      >
                        <td className="px-5 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-white">
                              {app.personalDetails?.fullName || app.applicant?.name || '—'}
                            </span>
                            <span className="text-xs text-slate-400">#{app._id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top text-sm text-slate-200">{app.loanProduct?.name || '—'}</td>
                        <td className="px-5 py-4 align-top text-sm text-slate-200">{formatCurrency(app.requestedAmount)}</td>
                        <td className="px-5 py-4 align-top">
                          <span className={statusBadge(app.status)}>{statusLabel(app.status)}</span>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
                            {actions.length === 0 ? (
                              <span className="text-xs text-slate-500">No actions available</span>
                            ) : (
                              actions.map((action) => (
                                <button
                                  key={action.value}
                                  type="button"
                                  disabled={savingId === app._id}
                                  onClick={() => handleStatusUpdate(app._id, action.value)}
                                  className={`rounded-full border px-3 py-2 text-xs font-medium transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${action.tone}`}
                                >
                                  {action.label}
                                </button>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-950/20">
                          <td colSpan={5} className="px-5 pb-5 pt-0">
                            <div className="mt-2 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-white">Application Details</p>
                                  <p className="text-sm text-slate-400">Employment and eligibility breakdown</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleRow(app._id)}
                                  className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                                >
                                  Collapse
                                </button>
                              </div>

                              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                                  <h4 className="text-sm font-semibold text-white">Employment Details</h4>
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <Detail label="Employment Type" value={app.employmentDetails?.employmentType || '—'} />
                                    <Detail label="Employer Name" value={app.employmentDetails?.employerName || '—'} />
                                    <Detail label="Monthly Income" value={formatCurrency(app.employmentDetails?.monthlyIncome)} />
                                    <Detail label="Experience Months" value={app.employmentDetails?.experienceMonths ?? '—'} />
                                  </div>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                                  <h4 className="text-sm font-semibold text-white">Eligibility Checks</h4>
                                  <div className="mt-4 space-y-3">
                                    {app.eligibility?.checks?.length ? (
                                      app.eligibility.checks.map((check) => (
                                        <div
                                          key={check.rule}
                                          className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
                                        >
                                          <div>
                                            <p className="text-sm font-medium text-white">{check.label}</p>
                                            <p className="mt-1 text-xs text-slate-400">Rule: {check.rule}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className={`text-sm font-semibold ${check.passed ? 'text-emerald-200' : 'text-rose-200'}`}>
                                              {check.passed ? 'Passed' : 'Failed'}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">Value: {formatEligibilityValue(check.value)}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-slate-400">No eligibility checks available.</p>
                                    )}

                                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overall Result</p>
                                      <p className={`mt-2 text-sm font-semibold ${app.eligibility?.isEligible ? 'text-emerald-200' : 'text-rose-200'}`}>
                                        {app.eligibility?.isEligible ? 'Eligible' : 'Not Eligible'}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-400">Evaluated at {formatDate(app.eligibility?.evaluatedAt)}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/6 p-4 lg:col-span-2">
                                  <h4 className="text-sm font-semibold text-white">Uploaded Documents</h4>
                                  <div className="mt-4 space-y-3">
                                    {app.documents?.length > 0 ? (
                                      app.documents.map((doc, index) => (
                                        <a
                                          key={`${doc.fileName}-${doc.filePath}-${index}`}
                                          href={getDocumentUrl(doc.filePath)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 transition hover:border-cyan-300/30 hover:bg-slate-950/50"
                                        >
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">{doc.fileName}</p>
                                            <p className="mt-1 text-xs text-slate-400">Click to open document</p>
                                          </div>
                                          <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
                                            Open
                                          </span>
                                        </a>
                                      ))
                                    ) : (
                                      <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-400">
                                        No documents uploaded yet
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}