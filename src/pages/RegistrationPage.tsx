import { RegistrationFormProvider } from '@/context/RegistrationFormContext';
import { RegistrationFormView } from '@/components/registration/RegistrationFormView';

export function RegistrationPage() {
  return (
    <RegistrationFormProvider>
      <RegistrationFormView />
    </RegistrationFormProvider>
  );
}
