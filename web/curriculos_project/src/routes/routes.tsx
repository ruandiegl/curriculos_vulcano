import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/dashboard/index.tsx';
import Login from '../pages/Login/index.tsx';
import Register from '../pages/register/index.tsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
