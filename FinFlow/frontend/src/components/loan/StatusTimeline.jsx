const HAPPY_PATH = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'verification', label: 'Verification' },
  { key: 'approved', label: 'Approved' },
  { key: 'agreement', label: 'Agreement' },
  { key: 'disbursed', label: 'Disbursed' },
];

// Maps backend status values onto a position in the happy-path pipeline above.
const STATUS_STEP_INDEX = {
  pending: 0,
  under_review: 1,
  approved: 2,
  agreement: 3,
  disbursed: 4,
};

export default function StatusTimeline({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {['Submitted', 'Verification'].map((label) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/20 text-xs font-semibold text-emerald-200">
                ✓
              </div>
              <span className="text-[11px] text-emerald-200/80">{label}</span>
            </div>
            <div className="mb-5 h-px w-6 bg-emerald-300/40 sm:w-10" />
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-300/50 bg-rose-400/20 text-xs font-semibold text-rose-200">
            ✕
          </div>
          <span className="text-[11px] text-rose-200">Rejected</span>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_STEP_INDEX[status] ?? 0;

  return (
    <div className="flex items-center">
      {HAPPY_PATH.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  isComplete
                    ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-200'
                    : isActive
                    ? 'border-cyan-300/50 bg-cyan-400/20 text-cyan-100'
                    : 'border-white/15 bg-white/5 text-slate-500'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </div>
              <span
                className={`text-[11px] ${
                  isActive ? 'text-white' : isComplete ? 'text-emerald-200/80' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < HAPPY_PATH.length - 1 && (
              <div className={`mx-1.5 mb-5 h-px flex-1 ${isComplete ? 'bg-emerald-300/40' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}