import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrationValidationErrors } from '@/lib/validateRegistrationForm';
import type {
  ConfirmationSnapshot,
  FurifaRegistrationForm,
} from '@/types/registration';

export const CONFIRMATION_STORAGE_KEY = 'furifa_registration_confirmation_v1';

const defaultForm: FurifaRegistrationForm = {
  fullName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  provinceId: '',
  provinceName: '',
  cityId: '',
  cityName: '',
  fullAddress: '',
  socialMediaPlatforms: [],
  socialMediaUsername: '',
  shopeeUsername: '',
  petType: '',
  petGender: '',
  petName: '',
  petAgeYears: '',
  agreedToPrivacy: false,
  agreedToAdminOnly: false,
};

type RegistrationFormContextValue = {
  form: FurifaRegistrationForm;
  setForm: (patch: Partial<FurifaRegistrationForm>) => void;
  setField: <K extends keyof FurifaRegistrationForm>(
    key: K,
    value: FurifaRegistrationForm[K]
  ) => void;
  submitting: boolean;
  submitError: string | null;
  submit: () => Promise<void>;
  reset: () => void;
};

const RegistrationFormContext = createContext<
  RegistrationFormContextValue | undefined
>(undefined);

const PET_TYPE_LABELS: Record<string, string> = {
  kucing: 'Kucing',
  anjing: 'Anjing',
  lainnya: 'Lainnya',
};

export function RegistrationFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [form, setFormState] = useState<FurifaRegistrationForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setForm = useCallback((patch: Partial<FurifaRegistrationForm>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setField = useCallback(
    <K extends keyof FurifaRegistrationForm>(
      key: K,
      value: FurifaRegistrationForm[K]
    ) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormState(defaultForm);
    setSubmitError(null);
  }, []);

  const submit = useCallback(async () => {
    setSubmitError(null);
    if (getRegistrationValidationErrors(form).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const snap: ConfirmationSnapshot = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        provinceName: form.provinceName,
        cityName: form.cityName,
        petName: form.petName,
        petType: PET_TYPE_LABELS[form.petType] ?? form.petType,
        submittedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(snap));
      navigate('/konfirmasi');
    } catch {
      setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }, [form, navigate]);

  const value = useMemo(
    () => ({
      form,
      setForm,
      setField,
      submitting,
      submitError,
      submit,
      reset,
    }),
    [form, setForm, setField, submitting, submitError, submit, reset]
  );

  return (
    <RegistrationFormContext.Provider value={value}>
      {children}
    </RegistrationFormContext.Provider>
  );
}

export function useRegistrationForm() {
  const ctx = useContext(RegistrationFormContext);
  if (!ctx) {
    throw new Error(
      'useRegistrationForm must be used within RegistrationFormProvider'
    );
  }
  return ctx;
}
