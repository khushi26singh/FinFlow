import { useFormContext } from 'react-hook-form';

const inputClass =
  'mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40';
const labelClass = 'text-sm text-slate-300';
const errorClass = 'mt-1 text-xs text-rose-300';

export default function EmploymentStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Employment</h2>
      <p className="mt-1 text-sm text-slate-300">Help us understand your income and work history.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Employment Type</label>
          <select {...register('employmentType', { required: 'Employment type is required' })} className={inputClass}>
            <option value="" className="bg-slate-900">
              Select type
            </option>
            <option value="salaried" className="bg-slate-900">
              Salaried
            </option>
            <option value="self_employed" className="bg-slate-900">
              Self-employed
            </option>
            <option value="business_owner" className="bg-slate-900">
              Business owner
            </option>
            <option value="unemployed" className="bg-slate-900">
              Unemployed
            </option>
          </select>
          {errors.employmentType && <p className={errorClass}>{errors.employmentType.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Employer / Business Name</label>
          <input {...register('employerName')} className={inputClass} placeholder="Optional" />
        </div>

        <div>
          <label className={labelClass}>Monthly Income (₹)</label>
          <input
            type="number"
            {...register('monthlyIncome', {
              required: 'Monthly income is required',
              min: { value: 0, message: 'Monthly income cannot be negative' },
            })}
            className={inputClass}
            placeholder="35000"
          />
          {errors.monthlyIncome && <p className={errorClass}>{errors.monthlyIncome.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Work Experience (months)</label>
          <input
            type="number"
            {...register('experienceMonths', {
              required: 'Experience is required',
              min: { value: 0, message: 'Experience cannot be negative' },
            })}
            className={inputClass}
            placeholder="18"
          />
          {errors.experienceMonths && <p className={errorClass}>{errors.experienceMonths.message}</p>}
        </div>
      </div>
    </div>
  );
}