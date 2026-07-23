import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/api';
import StepIndicator from '../../components/loan/wizard/StepIndicator';
import PersonalDetailsStep from '../../components/loan/wizard/PersonalDetailsStep';
import EmploymentStep from '../../components/loan/wizard/EmploymentStep';
import LoanDetailsStep from '../../components/loan/wizard/LoanDetailsStep';
import ReviewStep from '../../components/loan/wizard/ReviewStep';

const STEPS = [
  {
    id: 1,
    label: 'Personal Details',
    fields: ['fullName', 'dateOfBirth', 'phone', 'address', 'city', 'state', 'pincode'],
  },
  { id: 2, label: 'Employment', fields: ['employmentType', 'employerName', 'monthlyIncome', 'experienceMonths'] },
  { id: 3, label: 'Loan Details', fields: ['loanProduct', 'requestedAmount', 'tenureMonths'] },
  { id: 4, label: 'Review' },
];

export default function ApplyLoan() {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      employmentType: '',
      employerName: '',
      monthlyIncome: '',
      experienceMonths: '',
      loanProduct: location.state?.productId || '',
      requestedAmount: '',
      tenureMonths: '',
    },
  });

  const { trigger, handleSubmit, getValues } = methods;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/loan-products');
        setProducts(data.data || []);
      } catch (err) {
        toast.error('Failed to load loan products');
      }
    };
    fetchProducts();
  }, []);

  const goNext = async () => {
    const currentFields = STEPS.find((s) => s.id === step)?.fields || [];
    const valid = await trigger(currentFields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        loanProduct: values.loanProduct,
        requestedAmount: Number(values.requestedAmount),
        tenureMonths: Number(values.tenureMonths),
        personalDetails: {
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        employmentDetails: {
          employmentType: values.employmentType,
          employerName: values.employerName,
          monthlyIncome: Number(values.monthlyIncome),
          experienceMonths: Number(values.experienceMonths),
        },
      };

      await API.post('/loans/apply', payload);
      toast.success('Application submitted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#08111f_50%,_#03060d_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Loan Application</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Apply for a loan</h1>
          <p className="mt-2 text-sm text-slate-300">Complete all four steps to submit your application.</p>
        </div>

        <div className="mt-6">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur"
          >
            {step === 1 && <PersonalDetailsStep />}
            {step === 2 && <EmploymentStep />}
            {step === 3 && <LoanDetailsStep products={products} />}
            {step === 4 && <ReviewStep values={getValues()} products={products} />}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="rounded-full border border-white/15 bg-white/8 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}