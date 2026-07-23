export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur">
      {steps.map((s, index) => {
        const isActive = s.id === currentStep;
        const isComplete = s.id < currentStep;

        return (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isComplete
                    ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-200'
                    : isActive
                    ? 'border-cyan-300/50 bg-cyan-400/20 text-cyan-100'
                    : 'border-white/15 bg-white/5 text-slate-400'
                }`}
              >
                {isComplete ? '✓' : s.id}
              </div>
              <span className={`text-xs ${isActive ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${isComplete ? 'bg-emerald-300/40' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}