export default function LoanCard({ product, onApply }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{product.description}</p>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
          Active
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-3">
          <p className="text-slate-400">Interest</p>
          <p className="mt-1 text-lg font-semibold text-white">{product.interestRate}%</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-3">
          <p className="text-slate-400">Tenure</p>
          <p className="mt-1 text-lg font-semibold text-white">{product.tenureMonths} months</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-3">
          <p className="text-slate-400">Min Amount</p>
          <p className="mt-1 text-base font-semibold text-white">{formatCurrency(product.minAmount)}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-3">
          <p className="text-slate-400">Max Amount</p>
          <p className="mt-1 text-base font-semibold text-white">{formatCurrency(product.maxAmount)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApply?.(product)}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
      >
        Apply Now
      </button>
    </article>
  );
}