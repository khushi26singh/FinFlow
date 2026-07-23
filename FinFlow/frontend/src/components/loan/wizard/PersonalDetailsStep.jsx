import { useFormContext } from 'react-hook-form';

const inputClass =
  'mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-cyan-300/40';
const labelClass = 'text-sm text-slate-300';
const errorClass = 'mt-1 text-xs text-rose-300';

export default function PersonalDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Personal Details</h2>
      <p className="mt-1 text-sm text-slate-300">Tell us a bit about yourself.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full Name</label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            className={inputClass}
            placeholder="Khushi Sharma"
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Date of Birth</label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
            className={inputClass}
          />
          {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' },
            })}
            className={inputClass}
            placeholder="9876543210"
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <input
            {...register('address', { required: 'Address is required' })}
            className={inputClass}
            placeholder="House no, street, locality"
          />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input {...register('city', { required: 'City is required' })} className={inputClass} placeholder="Gorakhpur" />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>

        <div>
          <label className={labelClass}>State</label>
          <input
            {...register('state', { required: 'State is required' })}
            className={inputClass}
            placeholder="Uttar Pradesh"
          />
          {errors.state && <p className={errorClass}>{errors.state.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Pincode</label>
          <input
            {...register('pincode', {
              required: 'Pincode is required',
              pattern: { value: /^[0-9]{6}$/, message: 'Enter a valid 6-digit pincode' },
            })}
            className={inputClass}
            placeholder="273001"
          />
          {errors.pincode && <p className={errorClass}>{errors.pincode.message}</p>}
        </div>
      </div>
    </div>
  );
}