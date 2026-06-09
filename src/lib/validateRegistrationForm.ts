import type { FurifaRegistrationForm } from '@/types/registration';

export type RegistrationFieldId =
  | 'fullName'
  | 'phone'
  | 'email'
  | 'dateOfBirth'
  | 'gender'
  | 'province'
  | 'city'
  | 'fullAddress'
  | 'petType'
  | 'petGender'
  | 'petName'
  | 'petAgeYears'
  | 'privacy';

export type RegistrationValidationError = {
  fieldId: RegistrationFieldId;
  label: string;
  message: string;
};

const FIELD_ORDER: RegistrationFieldId[] = [
  'fullName',
  'phone',
  'email',
  'dateOfBirth',
  'gender',
  'province',
  'city',
  'fullAddress',
  'petType',
  'petGender',
  'petName',
  'petAgeYears',
  'privacy',
];

export function getRegistrationValidationErrors(
  form: FurifaRegistrationForm
): RegistrationValidationError[] {
  const errors: RegistrationValidationError[] = [];

  if (!form.fullName.trim()) {
    errors.push({
      fieldId: 'fullName',
      label: 'Nama Lengkap',
      message: 'Nama lengkap wajib diisi.',
    });
  }

  if (!form.phone.trim()) {
    errors.push({
      fieldId: 'phone',
      label: 'Nomor Telepon',
      message: 'Nomor telepon wajib diisi.',
    });
  } else if (form.phone.length < 10) {
    errors.push({
      fieldId: 'phone',
      label: 'Nomor Telepon',
      message: 'Nomor telepon minimal 10 digit.',
    });
  }

  if (!form.email.trim()) {
    errors.push({
      fieldId: 'email',
      label: 'Email',
      message: 'Email wajib diisi.',
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push({
      fieldId: 'email',
      label: 'Email',
      message: 'Format email tidak valid.',
    });
  }

  if (!form.dateOfBirth) {
    errors.push({
      fieldId: 'dateOfBirth',
      label: 'Tanggal Lahir',
      message: 'Tanggal lahir wajib diisi.',
    });
  }

  if (!form.gender) {
    errors.push({
      fieldId: 'gender',
      label: 'Jenis Kelamin',
      message: 'Jenis kelamin wajib dipilih.',
    });
  }

  if (!form.provinceId) {
    errors.push({
      fieldId: 'province',
      label: 'Provinsi',
      message: 'Provinsi wajib dipilih.',
    });
  }

  if (!form.cityId) {
    errors.push({
      fieldId: 'city',
      label: 'Kota / Kabupaten',
      message: 'Kota/Kabupaten wajib dipilih.',
    });
  }

  if (!form.fullAddress.trim()) {
    errors.push({
      fieldId: 'fullAddress',
      label: 'Alamat Lengkap',
      message: 'Alamat lengkap wajib diisi.',
    });
  }

  if (!form.petType) {
    errors.push({
      fieldId: 'petType',
      label: 'Jenis Hewan Peliharaan',
      message: 'Jenis hewan peliharaan wajib dipilih.',
    });
  }

  if (!form.petGender) {
    errors.push({
      fieldId: 'petGender',
      label: 'Gender Hewan Peliharaan',
      message: 'Gender hewan peliharaan wajib dipilih.',
    });
  }

  if (!form.petName.trim()) {
    errors.push({
      fieldId: 'petName',
      label: 'Nama Hewan Peliharaan',
      message: 'Nama hewan peliharaan wajib diisi.',
    });
  }

  if (!form.petAgeYears.trim()) {
    errors.push({
      fieldId: 'petAgeYears',
      label: 'Usia Hewan Peliharaan (Tahun)',
      message: 'Usia hewan peliharaan wajib diisi.',
    });
  }

  if (!form.agreedToPrivacy || !form.agreedToAdminOnly) {
    errors.push({
      fieldId: 'privacy',
      label: 'Pernyataan Privasi',
      message: 'Anda harus menyetujui pernyataan privasi.',
    });
  }

  const orderMap = new Map(FIELD_ORDER.map((id, index) => [id, index]));
  return errors.sort(
    (a, b) => (orderMap.get(a.fieldId) ?? 0) - (orderMap.get(b.fieldId) ?? 0)
  );
}

export function scrollToRegistrationField(fieldId: RegistrationFieldId) {
  const el = document.getElementById(`field-${fieldId}`);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('field-error-highlight');
  window.setTimeout(() => {
    el.classList.remove('field-error-highlight');
  }, 2200);
}
