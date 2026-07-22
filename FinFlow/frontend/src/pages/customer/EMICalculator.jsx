import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/api';
import EMIForm from '../../components/emi/EMIForm';
import EMIResult from '../../components/emi/EMIResult';
import EMIChart from '../../components/emi/EMIChart';
import AmortizationTable from '../../components/emi/AmortizationTable';

export default function EMICalculator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (formValues) => {
    setLoading(true);
    try {
      const { data } = await API.post('/emi/calculate', {
        loanAmount: Number(formValues.loanAmount),
        interestRate: Number(formValues.interestRate),
        tenureMonths: Number(formValues.tenureMonths),
      });
      setResult(data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to calculate EMI');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#08111f_50%,_#03060d_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">EMI Calculator</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Plan your monthly repayment</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Estimate your EMI, total interest, and full repayment schedule before you apply.
            </p>
          </div>
          <Link
            to="/loan-products"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Browse loan products
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <EMIForm onCalculate={handleCalculate} loading={loading} />

          <div className="flex flex-col gap-6">
            {result ? (
              <>
                <EMIResult result={result} />
                <div className="grid gap-6 lg:grid-cols-2">
                  <EMIChart result={result} />
                  <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/6 p-6 text-sm text-slate-300 backdrop-blur">
                    <p>
                      For a loan of <span className="font-semibold text-white">{formatCurrency(result.loanAmount)}</span> at{' '}
                      <span className="font-semibold text-white">{result.interestRate}%</span> over{' '}
                      <span className="font-semibold text-white">{result.tenureMonths} months</span>, you&apos;ll pay a
                      fixed EMI every month until the loan is fully repaid.
                    </p>
                  </div>
                </div>
                <AmortizationTable schedule={result.schedule} />
              </>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/10 bg-white/6 p-8 text-center text-slate-300 backdrop-blur">
                Enter your loan details to see your EMI breakdown.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}