import { useForm } from 'react-hook-form';

export default function EMIForm({ onCalculate, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loanAmount: 500000,
      interestRate: 11.5,
      tenureMonths: 36,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onCalculate)}
      className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur"
    >
      <h2 className="text-lg font-semibold text-white">Loan Details</h2>
      <p className="mt-1 text-sm text-slate-300">Enter your loan amount, interest rate, and tenure.</p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm text-slate-300">Loan Amount (₹)</label>
          <input
            type="number"
            step="1000"
            {...register('loanAmount', {
              required: 'Loan amount is required',
              min: { value: 1000, message: 'Minimum amount is ₹1,000' },
            })}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
          />
          {errors.loanAmount && <p className="mt-1 text-xs text-rose-300">{errors.loanAmount.message}</p>}
        </div>

        <div>
          <label className="text-sm text-slate-300">Interest Rate (% per annum)</label>
          <input
            type="number"
            step="0.1"
            {...register('interestRate', {
              required: 'Interest rate is required',
              min: { value: 0.1, message: 'Interest rate must be greater than 0' },
            })}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
          />
          {errors.interestRate && <p className="mt-1 text-xs text-rose-300">{errors.interestRate.message}</p>}
        </div>

        <div>
          <label className="text-sm text-slate-300">Tenure (months)</label>
          <input
            type="number"
            step="1"
            {...register('tenureMonths', {
              required: 'Tenure is required',
              min: { value: 1, message: 'Tenure must be at least 1 month' },
              validate: (value) => Number.isInteger(Number(value)) || 'Tenure must be a whole number',
            })}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
          />
          {errors.tenureMonths && <p className="mt-1 text-xs text-rose-300">{errors.tenureMonths.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Calculating...' : 'Calculate EMI'}
      </button>
    </form>
  );
}