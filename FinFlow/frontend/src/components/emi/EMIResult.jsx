export default function EMIResult({ result }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  if (!result) return null;

  const stats = [
    { label: 'Monthly EMI', value: formatCurrency(result.monthlyEmi), accent: 'from-cyan-400 to-emerald-400' },
    { label: 'Total Interest', value: formatCurrency(result.totalInterest), accent: 'from-amber-300 to-rose-300' },
    { label: 'Total Amount Payable', value: formatCurrency(result.totalAmount), accent: 'from-emerald-400 to-cyan-400' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur"
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent} opacity-80`} />
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}