import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';

const emptyForm = {
  name: '',
  type: '',
  minAmount: '',
  maxAmount: '',
  interestRate: '',
  tenureMonths: '',
  processingFee: '',
  description: '',
  isActive: true,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

export default function LoanProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await API.get('/loan-products');
      setProducts(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load loan products');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId('');
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      type: product.type || '',
      minAmount: product.minAmount ?? '',
      maxAmount: product.maxAmount ?? '',
      interestRate: product.interestRate ?? '',
      tenureMonths: product.tenureMonths ?? '',
      processingFee: product.processingFee ?? '',
      description: product.description || '',
      isActive: product.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId('');
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const payload = {
        ...form,
        minAmount: Number(form.minAmount),
        maxAmount: Number(form.maxAmount),
        interestRate: Number(form.interestRate),
        tenureMonths: Number(form.tenureMonths),
        processingFee: Number(form.processingFee || 0),
      };

      if (editingId) {
        await API.put(`/loan-products/${editingId}`, payload);
        toast.success('Loan product updated');
      } else {
        await API.post('/loan-products', payload);
        toast.success('Loan product created');
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await API.delete(`/loan-products/${product._id}`);
      toast.success('Loan product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Loan Products</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Admin Product Management</h1>
            <p className="mt-2 text-sm text-slate-300">Create, edit, and delete loan products from a single workspace.</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
          >
            Add New Product
          </button>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100 backdrop-blur">{error}</div>}

      <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur">
        <div className="border-b border-white/10 px-5 py-4 text-sm text-slate-300">Existing Products</div>

        {loading ? (
          <div className="p-6 text-slate-300">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-slate-300">No loan products available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-950/25">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Name</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Amount Range</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Interest Rate</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Tenure</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr key={product._id} className="bg-white/0 transition hover:bg-white/5">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white">{product.name}</span>
                        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${product.isActive ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100' : 'border-rose-300/20 bg-rose-400/10 text-rose-100'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-slate-200">
                      {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-slate-200">{product.interestRate ?? '—'}%</td>
                    <td className="px-5 py-4 align-top text-sm text-slate-200">{product.tenureMonths ?? '—'} months</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">{editingId ? 'Edit Product' : 'New Product'}</p>
                <h2 className="mt-2 text-2xl font-semibold">{editingId ? 'Update Loan Product' : 'Create Loan Product'}</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
              <Field label="Type" name="type" value={form.type} onChange={handleChange} required />
              <Field label="Min Amount" name="minAmount" type="number" value={form.minAmount} onChange={handleChange} required />
              <Field label="Max Amount" name="maxAmount" type="number" value={form.maxAmount} onChange={handleChange} required />
              <Field label="Interest Rate" name="interestRate" type="number" step="0.1" value={form.interestRate} onChange={handleChange} required />
              <Field label="Tenure Months" name="tenureMonths" type="number" value={form.tenureMonths} onChange={handleChange} required />
              <Field label="Processing Fee" name="processingFee" type="number" step="0.1" value={form.processingFee} onChange={handleChange} />

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-slate-300">Description</span>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950/40"
                />
                Active product
              </label>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label>
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
      />
    </label>
  );
}