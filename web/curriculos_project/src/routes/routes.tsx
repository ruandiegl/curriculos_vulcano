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
import NewCertification from '../pages/NewCertification/index.tsx';
import NewSkill from '../pages/newSkill/index.tsx';
import NewExperience from '../pages/newExperience/index.tsx';
import NewEducation from '../pages/newEducation/index.tsx';
import UploadPDF from '../pages/UploadPDF/index.tsx';

type RouteGuardProps = {
  children: ReactNode;
  adminOnly?: boolean;
};

function getAuthenticatedPath(user: ReturnType<typeof useAuth>['user']) {
  if (user?.tipo === 'admin') {
    return '/dashboard';
  }

  if (user?.possuiCurriculo) {
    return '/profile';
  }

  return '/newCurriculum';
}

function PublicRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  return children;
}

function PrivateRoute({ children, adminOnly = false }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.tipo !== 'admin') {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute adminOnly>
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
        path="/newCurriculum"
        element={
          <PrivateRoute>
            <NewCurriculum />
          </PrivateRoute>
        }
      />
      <Route
        path="/newAddress"
        element={
          <PrivateRoute>
            <NewAddress />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload-pdf"
        element={
          <PrivateRoute>
            <UploadPDF />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-education"
        element={
          <PrivateRoute>
            <NewEducation />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-experience"
        element={
          <PrivateRoute>
            <NewExperience />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-skill"
        element={
          <PrivateRoute>
            <NewSkill />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-certification"
        element={
          <PrivateRoute>
            <NewCertification />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
