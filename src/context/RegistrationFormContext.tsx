import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
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

function validateForm(form: FurifaRegistrationForm): string | null {
  if (!form.fullName.trim()) return 'Nama lengkap wajib diisi.';
  if (!form.phone.trim() || form.phone.length < 10)
    return 'Nomor telepon wajib diisi (min. 10 digit).';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return 'Email wajib diisi dengan format yang benar.';
  if (!form.dateOfBirth) return 'Tanggal lahir wajib diisi.';
  if (!form.gender) return 'Jenis kelamin wajib dipilih.';
  if (!form.provinceId) return 'Provinsi wajib dipilih.';
  if (!form.cityId) return 'Kota/Kabupaten wajib dipilih.';
  if (!form.fullAddress.trim()) return 'Alamat lengkap wajib diisi.';
  if (!form.petType) return 'Jenis hewan peliharaan wajib dipilih.';
  if (!form.petGender) return 'Gender hewan peliharaan wajib dipilih.';
  if (!form.petName.trim()) return 'Nama hewan peliharaan wajib diisi.';
  if (!form.petAgeYears.trim()) return 'Usia hewan peliharaan wajib diisi.';
  if (!form.agreedToPrivacy || !form.agreedToAdminOnly)
    return 'Anda harus menyetujui pernyataan privasi.';
  return null;
}

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
    const validationError = validateForm(form);
    if (validationError) {
      setSubmitError(validationError);
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
