import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RegistrationPage } from '@/pages/RegistrationPage';
import { ConfirmationPage } from '@/pages/ConfirmationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RegistrationPage />} />
        <Route path='/konfirmasi' element={<ConfirmationPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
