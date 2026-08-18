import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../pages/dashboard/index.tsx';
import Edit from '../pages/edit/index.tsx';
import Login from '../pages/Login/index.tsx';
import Register from '../pages/register/index.tsx';
import ForgotPassword from '../pages/ForgotPassword/index.tsx';
import RecoverAccess from '../pages/RecoverAccess/index.tsx';
import ResetPassword from '../pages/ResetPassword/index.tsx';
import ActivateAccount from '../pages/ActivateAccount/index.tsx';
import View from '../pages/view/index.tsx';
import NewCurriculum from '../pages/newCurriculum/index.tsx';
import NewAddress from '../pages/newAddress/index.tsx';
import Profile from '../pages/Profile/index.tsx';
import NewCertification from '../pages/NewCertification/index.tsx';
import NewSkill from '../pages/newSkill/index.tsx';
import NewExperience from '../pages/newExperience/index.tsx';
import NewEducation from '../pages/newEducation/index.tsx';
import UploadPDF from '../pages/UploadPDF/index.tsx';
import NewJob from '../pages/newJob/index.tsx';
import Jobs from '../pages/jobs/index.tsx';
import Reports from '../pages/reports/index.tsx';
import Users from '../pages/users/index.tsx';

type RouteGuardProps = {
  children: ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  userOnly?: boolean;
};

function isAdminTipo(tipo?: string) {
  return tipo === 'admin' || tipo === 'superAdmin';
}

function getAuthenticatedPath(user: ReturnType<typeof useAuth>['user']) {
  if (isAdminTipo(user?.tipo)) {
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

function PrivateRoute({ children, adminOnly = false, superAdminOnly = false, userOnly = false }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdminTipo(user?.tipo)) {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  if (superAdminOnly && user?.tipo !== 'superAdmin') {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  if (userOnly && isAdminTipo(user?.tipo)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function ScrollToRouteTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function AppRoutes() {
  return (
    <>
    <ScrollToRouteTop />
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/recover-acces" element={<RecoverAccess />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/activate-account" element={<ActivateAccount />} />
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
          <PrivateRoute userOnly>
            <NewCurriculum />
          </PrivateRoute>
        }
      />
      <Route
        path="/newAddress"
        element={
          <PrivateRoute userOnly>
            <NewAddress />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute userOnly>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload-pdf"
        element={
          <PrivateRoute userOnly>
            <UploadPDF />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-education"
        element={
          <PrivateRoute userOnly>
            <NewEducation />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-experience"
        element={
          <PrivateRoute userOnly>
            <NewExperience />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-skill"
        element={
          <PrivateRoute userOnly>
            <NewSkill />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-certification"
        element={
          <PrivateRoute userOnly>
            <NewCertification />
          </PrivateRoute>
        }
      />
      <Route
        path="/newJob"
        element={
          <PrivateRoute adminOnly>
            <NewJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute adminOnly>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute superAdminOnly>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/vagas"
        element={
          <PrivateRoute userOnly>
            <Jobs />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
