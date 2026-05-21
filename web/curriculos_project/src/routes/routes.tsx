import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../pages/dashboard/index.tsx';
import Edit from '../pages/edit/index.tsx';
import Login from '../pages/Login/index.tsx';
import Register from '../pages/register/index.tsx';
import View from '../pages/view/index.tsx';
import NewCurriculum from '../pages/newCurriculum/index.tsx';
import NewAddress from '../pages/newAddress/index.tsx';
import Profile from '../pages/Profile/index.tsx';
import UploadPDF from '../pages/UploadPDF/index.tsx';

type PrivateRouteProps = {
  children: ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
   console.log('isAuthenticated:', isAuthenticated); // ← adicione isso

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/view/:id"
        element={
          <PrivateRoute>
            <View />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <Edit />
          </PrivateRoute>
        }
      />
      <Route 
      path="/newCurriculum" element={
        <PrivateRoute>  
          <NewCurriculum />
        </PrivateRoute>
      } />
      <Route 
      path="/newAddress" element={
        <PrivateRoute>  
          <NewAddress />
        </PrivateRoute>
      } />
      <Route
      path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route
      path="/upload-pdf" element={
        <PrivateRoute>
          <UploadPDF />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
