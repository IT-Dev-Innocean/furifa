import { Icon } from '@iconify/react';
import type { RegistrationValidationError } from '@/lib/validateRegistrationForm';
import { scrollToRegistrationField } from '@/lib/validateRegistrationForm';
import { Button } from '@/components/ui/button';

type ValidationAlertModalProps = {
  open: boolean;
  errors: RegistrationValidationError[];
  onClose: () => void;
};

export function ValidationAlertModal({
  open,
  errors,
  onClose,
}: ValidationAlertModalProps) {
  if (!open || errors.length === 0) return null;

  const handleItemClick = (error: RegistrationValidationError) => {
    onClose();
    window.setTimeout(() => {
      scrollToRegistrationField(error.fieldId);
    }, 150);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='validation-modal-title'>
      <button
        type='button'
        className='absolute inset-0 bg-black/35 backdrop-blur-sm'
        aria-label='Tutup'
        onClick={onClose}
      />

      <div className='relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:p-6'>
        <div className='mb-4 flex items-start gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50'>
            <Icon
              icon='mdi:alert-circle-outline'
              className='h-6 w-6 text-rc-red'
              aria-hidden
            />
          </div>
          <div>
            <h2
              id='validation-modal-title'
              className='text-base font-bold text-neutral-900'>
              Form belum lengkap
            </h2>
            <p className='mt-1 text-sm text-neutral-600'>
              Mohon lengkapi field berikut sebelum melanjutkan:
            </p>
          </div>
        </div>

        <ul className='max-h-64 space-y-2 overflow-y-auto pr-1'>
          {errors.map((error) => (
            <li key={`${error.fieldId}-${error.message}`}>
              <button
                type='button'
                onClick={() => handleItemClick(error)}
                className='flex w-full items-start gap-2 rounded-lg border border-red-100 bg-red-50/70 px-3 py-2.5 text-left text-sm transition hover:border-red-200 hover:bg-red-50'>
                <Icon
                  icon='mdi:chevron-right'
                  className='mt-0.5 h-4 w-4 shrink-0 text-rc-red'
                  aria-hidden
                />
                <span>
                  <span className='font-semibold text-neutral-900'>
                    {error.label}
                  </span>
                  <span className='mt-0.5 block text-neutral-600'>
                    {error.message}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className='mt-5 flex justify-end'>
          <Button type='button' variant='outline' size='sm' onClick={onClose}>
            Mengerti
          </Button>
        </div>
      </div>
    </div>
  );
}
