import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoanCard from '../../components/loan/LoanCard';

export default function LoanProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        const { data } = await API.get('/loan-products');
        setProducts(data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load loan products');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanProducts();
  }, []);

  const handleApply = (product) => {
    console.log('Apply for product:', product);
  };

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#08111f_50%,_#03060d_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Loan Products</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Choose the right loan for the job</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Compare rates, amounts, and tenures before you apply.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Back to dashboard
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/6 p-8 text-center text-slate-300 backdrop-blur">
            Loading loan products...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-300/20 bg-rose-500/10 p-8 text-rose-100 backdrop-blur">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <LoanCard key={product._id} product={product} onApply={handleApply} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/6 p-8 text-center text-slate-300 backdrop-blur">
            No loan products are available right now.
          </div>
        )}
      </div>
    </div>
  );
}