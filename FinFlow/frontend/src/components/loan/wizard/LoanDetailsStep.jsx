import { useFormContext } from 'react-hook-form';

const inputClass =
  'mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40';
const labelClass = 'text-sm text-slate-300';
const errorClass = 'mt-1 text-xs text-rose-300';

export default function LoanDetailsStep({ products }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedProductId = watch('loanProduct');
  const selectedProduct = products.find((p) => p._id === selectedProductId);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Loan Details</h2>
      <p className="mt-1 text-sm text-slate-300">Pick a loan product and tell us how much you need.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Loan Product</label>
          <select {...register('loanProduct', { required: 'Please select a loan product' })} className={inputClass}>
            <option value="" className="bg-slate-900">
              Select a loan product
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id} className="bg-slate-900">
                {product.name} — {product.interestRate}%
              </option>
            ))}
          </select>
          {errors.loanProduct && <p className={errorClass}>{errors.loanProduct.message}</p>}
          {selectedProduct && (
            <p className="mt-2 text-xs text-slate-400">
              Range: ₹{selectedProduct.minAmount?.toLocaleString('en-IN')} – ₹
              {selectedProduct.maxAmount?.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Requested Amount (₹)</label>
          <input
            type="number"
            {...register('requestedAmount', {
              required: 'Requested amount is required',
              min: { value: 1000, message: 'Minimum amount is ₹1,000' },
            })}
            className={inputClass}
            placeholder="500000"
          />
          {errors.requestedAmount && <p className={errorClass}>{errors.requestedAmount.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Tenure (months)</label>
          <input
            type="number"
            {...register('tenureMonths', {
              required: 'Tenure is required',
              min: { value: 1, message: 'Tenure must be at least 1 month' },
            })}
            className={inputClass}
            placeholder="36"
          />
          {errors.tenureMonths && <p className={errorClass}>{errors.tenureMonths.message}</p>}
        </div>
      </div>
    </div>
  );
}