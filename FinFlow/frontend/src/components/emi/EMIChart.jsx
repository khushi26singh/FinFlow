import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22d3ee', '#f59e0b'];

export default function EMIChart({ result }) {
  if (!result) return null;

  const data = [
    { name: 'Principal', value: result.loanAmount },
    { name: 'Total Interest', value: result.totalInterest },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-white">Principal vs Interest</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}