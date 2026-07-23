export default function ReviewStep({ formData = {}, selectedProduct = {} }) {
  return (
    <div className="space-y-6 text-white">
      <div>
        <h3 className="text-xl font-bold text-cyan-400">Review Application</h3>
        <p className="text-sm text-slate-400">Please verify your details before submitting.</p>
      </div>

      {/* Personal Details */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
        <h4 className="font-semibold text-slate-300 border-b border-white/10 pb-1">Personal Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="text-slate-400">Full Name:</span> {formData.fullName || '—'}</p>
          <p><span className="text-slate-400">DOB:</span> {formData.dateOfBirth || '—'}</p>
          <p><span className="text-slate-400">Phone:</span> {formData.phone || '—'}</p>
          <p><span className="text-slate-400">City:</span> {formData.city || '—'}</p>
        </div>
      </div>

      {/* Employment Details */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
        <h4 className="font-semibold text-slate-300 border-b border-white/10 pb-1">Employment Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="text-slate-400">Type:</span> {formData.employmentType || '—'}</p>
          <p><span className="text-slate-400">Employer:</span> {formData.employerName || '—'}</p>
          <p><span className="text-slate-400">Monthly Income:</span> ₹{formData.monthlyIncome || '0'}</p>
          <p><span className="text-slate-400">Experience:</span> {formData.experienceMonths || '0'} months</p>
        </div>
      </div>

      {/* Loan Details */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
        <h4 className="font-semibold text-slate-300 border-b border-white/10 pb-1">Loan Information</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="text-slate-400">Product:</span> {selectedProduct?.name || 'Personal Loan'}</p>
          <p><span className="text-slate-400">Requested Amount:</span> ₹{formData.requestedAmount || '0'}</p>
          <p><span className="text-slate-400">Tenure:</span> {formData.tenureMonths || '0'} months</p>
        </div>
      </div>
    </div>
  );
}