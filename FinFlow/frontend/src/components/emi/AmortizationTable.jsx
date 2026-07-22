export default function AmortizationTable({ schedule }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  if (!schedule?.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-white">Amortization Schedule</h3>
      <p className="mt-1 text-sm text-slate-300">Month-by-month breakdown of your repayments.</p>

      <div className="mt-4 max-h-96 overflow-y-auto rounded-2xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-950/80 text-slate-400 backdrop-blur">
            <tr>
              <th className="px-4 py-3 font-medium">Month</th>
              <th className="px-4 py-3 font-medium">EMI</th>
              <th className="px-4 py-3 font-medium">Principal</th>
              <th className="px-4 py-3 font-medium">Interest</th>
              <th className="px-4 py-3 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {schedule.map((row) => (
              <tr key={row.month} className="hover:bg-white/5">
                <td className="px-4 py-3">{row.month}</td>
                <td className="px-4 py-3">{formatCurrency(row.emi)}</td>
                <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}