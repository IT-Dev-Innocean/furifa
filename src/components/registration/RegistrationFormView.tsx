import { Icon } from '@iconify/react';
import { useRegistrationForm } from '@/context/RegistrationFormContext';
import { useProvinces, useRegencies } from '@/hooks/useWilayah';
import { PrivacySection } from '@/components/registration/PrivacySection';
import { RoyalCaninLogo } from '@/components/registration/RoyalCaninLogo';
import {
  RegistrationStyledSelect,
  type RegistrationStyledOption,
} from '@/components/registration/RegistrationStyledSelect';
import { RegistrationFooter } from '@/components/registration/RegistrationFooter';
import { FadeIn } from '@/components/magicui/fade-in';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { SocialMediaOption } from '@/types/registration';

const GENDER_OPTIONS: RegistrationStyledOption[] = [
  { value: 'laki_laki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
];

const SOCIAL_MEDIA_OPTIONS: { value: SocialMediaOption; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lainnya', label: 'Lainnya' },
];

const PET_TYPE_OPTIONS: RegistrationStyledOption[] = [
  { value: 'kucing', label: 'Kucing' },
  { value: 'anjing', label: 'Anjing' },
  { value: 'lainnya', label: 'Lainnya' },
];

const PET_GENDER_OPTIONS: RegistrationStyledOption[] = [
  { value: 'jantan', label: 'Jantan' },
  { value: 'betina', label: 'Betina' },
];

export function RegistrationFormView() {
  const { form, setField, setForm, submit, submitting, submitError } =
    useRegistrationForm();
  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const { data: regencies = [], isLoading: regenciesLoading } = useRegencies(
    form.provinceId
  );

  const provinceOptions: RegistrationStyledOption[] = provinces.map(
    (p: { id: any; name: any }) => ({
      value: p.id,
      label: p.name,
    })
  );

  const regencyOptions: RegistrationStyledOption[] = regencies.map(
    (r: { id: any; name: any }) => ({
      value: r.id,
      label: r.name,
    })
  );

  const toggleSocialMedia = (platform: SocialMediaOption) => {
    const current = form.socialMediaPlatforms;
    if (current.includes(platform)) {
      setField(
        'socialMediaPlatforms',
        current.filter((p) => p !== platform)
      );
    } else {
      setField('socialMediaPlatforms', [...current, platform]);
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='relative flex-1 overflow-hidden pb-8'>
        <div
          className='pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-neutral-100/80 blur-2xl'
          aria-hidden
        />
        <div
          className='pointer-events-none absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-neutral-100/80 blur-2xl'
          aria-hidden
        />

        <div className='relative mx-auto flex max-w-lg flex-col gap-6 px-4 pb-8 pt-8'>
          <FadeIn>
            <RoyalCaninLogo className='mb-2' />
          </FadeIn>

          <FadeIn delay={100}>
            <h2 className='text-3xl font-bold text-center text-rc-red'>
              FURIFA 2026
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <form
              className='flex flex-col gap-4'
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}>
              <div className='rounded-md border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6'>
                <div className='flex flex-col gap-5'>
                  <div>
                    <Label htmlFor='fullName' required>
                      Nama Lengkap
                    </Label>
                    <Input
                      id='fullName'
                      name='fullName'
                      type='text'
                      required
                      value={form.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      placeholder='Masukkan Nama Lengkap'
                    />
                  </div>

                  <div>
                    <Label htmlFor='phone' required>
                      Nomor Telepon
                    </Label>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      inputMode='numeric'
                      autoComplete='tel'
                      required
                      minLength={10}
                      maxLength={13}
                      value={form.phone}
                      onKeyDown={(e) => {
                        if (
                          e.key.length === 1 &&
                          !/[0-9]/.test(e.key) &&
                          !e.ctrlKey &&
                          !e.metaKey
                        )
                          e.preventDefault();
                      }}
                      onChange={(e) =>
                        setField('phone', e.target.value.replace(/\D/g, ''))
                      }
                      placeholder='081234567890'
                    />
                  </div>

                  <div>
                    <Label htmlFor='email' required>
                      Email
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder='Masukkan Email (nama@gmail.com)'
                    />
                  </div>

                  <div>
                    <Label htmlFor='dateOfBirth' required>
                      Tanggal Lahir
                    </Label>
                    <Input
                      id='dateOfBirth'
                      name='dateOfBirth'
                      type='date'
                      required
                      value={form.dateOfBirth}
                      onChange={(e) => setField('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor='gender' required>
                      Jenis Kelamin
                    </Label>
                    <RegistrationStyledSelect
                      id='gender'
                      name='gender'
                      value={form.gender}
                      onValueChange={(v) =>
                        setField('gender', v as typeof form.gender)
                      }
                      options={GENDER_OPTIONS}
                      placeholder='Pilih Jenis Kelamin'
                    />
                  </div>

                  <div>
                    <Label htmlFor='province' required>
                      Provinsi
                    </Label>
                    <RegistrationStyledSelect
                      id='province'
                      name='province'
                      value={form.provinceId}
                      onValueChange={(v) => {
                        const selected = provinces.find(
                          (p: { id: string }) => p.id === v
                        );
                        setForm({
                          provinceId: v,
                          provinceName: selected?.name ?? '',
                          cityId: '',
                          cityName: '',
                        });
                      }}
                      options={
                        provincesLoading
                          ? [
                              {
                                value: '_loading',
                                label: 'Memuat...',
                                disabled: true,
                              },
                            ]
                          : provinceOptions
                      }
                      placeholder='Pilih provinsi'
                      disabled={provincesLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor='city' required>
                      Kota / Kabupaten
                    </Label>
                    <RegistrationStyledSelect
                      id='city'
                      name='city'
                      value={form.cityId}
                      onValueChange={(v) => {
                        const selected = regencies.find(
                          (r: { id: string }) => r.id === v
                        );
                        setForm({
                          cityId: v,
                          cityName: selected?.name ?? '',
                        });
                      }}
                      options={
                        !form.provinceId
                          ? [
                              {
                                value: '_empty',
                                label: 'Pilih provinsi terlebih dahulu',
                                disabled: true,
                              },
                            ]
                          : regenciesLoading
                            ? [
                                {
                                  value: '_loading',
                                  label: 'Memuat...',
                                  disabled: true,
                                },
                              ]
                            : regencyOptions
                      }
                      placeholder='Pilih provinsi terlebih dahulu'
                      disabled={!form.provinceId || regenciesLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor='fullAddress' required>
                      Alamat Lengkap
                    </Label>
                    <Textarea
                      id='fullAddress'
                      name='fullAddress'
                      required
                      value={form.fullAddress}
                      onChange={(e) => setField('fullAddress', e.target.value)}
                      placeholder='Masukkan Alamat Lengkap'
                    />
                  </div>

                  <div
                    role='group'
                    aria-labelledby='social-media-label'
                    className='min-w-0'>
                    <p
                      id='social-media-label'
                      className='mb-1.5 block text-sm font-bold text-neutral-900'>
                      Media sosial yang digunakan
                    </p>
                    <p className='mb-2 text-xs text-neutral-600'>
                      Boleh pilih lebih dari satu
                    </p>
                    <div className='flex flex-col gap-2'>
                      {SOCIAL_MEDIA_OPTIONS.map((opt) => {
                        const selected = form.socialMediaPlatforms.includes(
                          opt.value
                        );
                        return (
                          <label
                            key={opt.value}
                            htmlFor={`social-${opt.value}`}
                            className={`flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 text-sm font-medium transition ${
                              selected
                                ? 'border-rc-red bg-red-50/60 text-neutral-900'
                                : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400'
                            }`}>
                            <input
                              id={`social-${opt.value}`}
                              type='checkbox'
                              checked={selected}
                              onChange={() => toggleSocialMedia(opt.value)}
                              className='rc-checkbox'
                            />
                            {opt.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='socialMediaUsername'>
                      Username Media Sosial
                    </Label>
                    <Input
                      id='socialMediaUsername'
                      name='socialMediaUsername'
                      type='text'
                      value={form.socialMediaUsername}
                      onChange={(e) =>
                        setField('socialMediaUsername', e.target.value)
                      }
                      placeholder='Contoh: @nama_akun'
                    />
                  </div>

                  <div>
                    <Label htmlFor='shopeeUsername'>Username Shopee</Label>
                    <Input
                      id='shopeeUsername'
                      name='shopeeUsername'
                      type='text'
                      value={form.shopeeUsername}
                      onChange={(e) =>
                        setField('shopeeUsername', e.target.value)
                      }
                      placeholder='Masukkan Username Akun Shopee'
                    />
                  </div>

                  <div>
                    <Label htmlFor='petType' required>
                      Jenis Hewan Peliharaan
                    </Label>
                    <RegistrationStyledSelect
                      id='petType'
                      name='petType'
                      value={form.petType}
                      onValueChange={(v) =>
                        setField('petType', v as typeof form.petType)
                      }
                      options={PET_TYPE_OPTIONS}
                      placeholder='Pilih Jenis Hewan Peliharaan'
                    />
                  </div>

                  <div>
                    <Label htmlFor='petGender' required>
                      Gender Hewan Peliharaan
                    </Label>
                    <RegistrationStyledSelect
                      id='petGender'
                      name='petGender'
                      value={form.petGender}
                      onValueChange={(v) =>
                        setField('petGender', v as typeof form.petGender)
                      }
                      options={PET_GENDER_OPTIONS}
                      placeholder='Pilih Gender Hewan Peliharaan'
                    />
                  </div>

                  <div>
                    <Label htmlFor='petName' required>
                      Nama Hewan Peliharaan
                    </Label>
                    <Input
                      id='petName'
                      name='petName'
                      type='text'
                      required
                      value={form.petName}
                      onChange={(e) => setField('petName', e.target.value)}
                      placeholder='Masukkan Nama Hewan Peliharaan'
                    />
                  </div>

                  <div>
                    <Label htmlFor='petAgeYears' required>
                      Usia Hewan Peliharaan (Tahun)
                    </Label>
                    <Input
                      id='petAgeYears'
                      name='petAgeYears'
                      type='text'
                      inputMode='numeric'
                      required
                      value={form.petAgeYears}
                      onKeyDown={(e) => {
                        if (
                          e.key.length === 1 &&
                          !/[0-9]/.test(e.key) &&
                          !e.ctrlKey &&
                          !e.metaKey
                        )
                          e.preventDefault();
                      }}
                      onChange={(e) =>
                        setField(
                          'petAgeYears',
                          e.target.value.replace(/\D/g, '')
                        )
                      }
                      placeholder='Masukkan Usia Hewan Peliharaan (Tahun)'
                    />
                  </div>
                </div>
              </div>

              <PrivacySection />

              {submitError ? (
                <p
                  className='rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700'
                  role='alert'>
                  {submitError}
                </p>
              ) : null}

              <div className='flex flex-col items-center gap-3 pt-4'>
                <Button
                  type='submit'
                  disabled={submitting}
                  size='lg'
                  className='w-full max-w-xs cursor-pointer'>
                  {submitting ? (
                    <>
                      <Icon
                        icon='svg-spinners:ring-resize'
                        className='h-5 w-5'
                      />
                      Memproses…
                    </>
                  ) : (
                    'Submit Registrasi'
                  )}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      </main>

      <RegistrationFooter />
    </div>
  );
}
