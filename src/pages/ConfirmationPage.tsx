import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CONFIRMATION_STORAGE_KEY,
  RegistrationFormProvider,
} from '@/context/RegistrationFormContext';
import { RoyalCaninLogo } from '@/components/registration/RoyalCaninLogo';
import { RegistrationFooter } from '@/components/registration/RegistrationFooter';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/magicui/fade-in';
import type { ConfirmationSnapshot } from '@/types/registration';

function ConfirmationContent() {
  const [snapshot, setSnapshot] = useState<ConfirmationSnapshot | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (raw) {
      try {
        setSnapshot(JSON.parse(raw) as ConfirmationSnapshot);
      } catch {
        setSnapshot(null);
      }
    }
  }, []);

  if (!snapshot) {
    return (
      <div className='flex min-h-screen flex-col'>
        <main className='flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16'>
          <p className='text-center text-neutral-600'>
            Data konfirmasi tidak ditemukan.
          </p>
          <Button asChild variant='outline'>
            <Link to='/'>Kembali ke formulir</Link>
          </Button>
        </main>
        <RegistrationFooter />
      </div>
    );
  }

  const submittedDate = new Date(snapshot.submittedAt).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='relative flex-1 overflow-hidden pb-8'>
        <div className='relative mx-auto flex max-w-lg flex-col gap-6 px-4 pb-8 pt-8'>
          <FadeIn>
            <RoyalCaninLogo className='mb-2' />
          </FadeIn>

          <FadeIn delay={100}>
            <div className='rounded-md border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6'>
              <h1 className='mb-2 text-center text-lg font-bold text-rc-red'>
                FURIFA 2026
              </h1>
              <p className='mb-6 text-center text-sm text-neutral-600'>
                Terima kasih! Data registrasi Anda telah tercatat.
              </p>

              <dl className='space-y-3 text-sm'>
                <div className='flex justify-between gap-4 border-b border-neutral-100 pb-2'>
                  <dt className='font-medium text-neutral-600'>Nama</dt>
                  <dd className='text-right font-semibold text-neutral-900'>
                    {snapshot.fullName}
                  </dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-neutral-100 pb-2'>
                  <dt className='font-medium text-neutral-600'>Email</dt>
                  <dd className='text-right text-neutral-900'>
                    {snapshot.email}
                  </dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-neutral-100 pb-2'>
                  <dt className='font-medium text-neutral-600'>Telepon</dt>
                  <dd className='text-right text-neutral-900'>
                    {snapshot.phone}
                  </dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-neutral-100 pb-2'>
                  <dt className='font-medium text-neutral-600'>Lokasi</dt>
                  <dd className='text-right text-neutral-900'>
                    {snapshot.cityName}, {snapshot.provinceName}
                  </dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-neutral-100 pb-2'>
                  <dt className='font-medium text-neutral-600'>Hewan</dt>
                  <dd className='text-right text-neutral-900'>
                    {snapshot.petName} ({snapshot.petType})
                  </dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='font-medium text-neutral-600'>Waktu</dt>
                  <dd className='text-right text-neutral-900'>
                    {submittedDate}
                  </dd>
                </div>
              </dl>
            </div>

            {/* <div className='flex justify-center pt-6'>
              <Button asChild variant='outline' size='lg'>
                <Link to='/'>Kembali ke formulir</Link>
              </Button>
            </div> */}
          </FadeIn>
        </div>
      </main>
      <RegistrationFooter />
    </div>
  );
}

export function ConfirmationPage() {
  return (
    <RegistrationFormProvider>
      <ConfirmationContent />
    </RegistrationFormProvider>
  );
}
