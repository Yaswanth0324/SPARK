import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/mockData';
import { Spinner } from '../components/ui/UIComponents';

const DASHBOARD_ROUTES = {
  [ROLES.SYSTEM_ADMIN]: '/dashboard/system-admin',
  [ROLES.COLLEGE_ADMIN]: '/dashboard/college-admin',
  [ROLES.HOD]: '/dashboard/hod',
  [ROLES.MENTOR]: '/dashboard/mentor',
  [ROLES.STUDENT]: '/dashboard/student',
};

// Redirects unauthenticated users to /login
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  }
  return children;
};

// Redirects authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (user) return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  return children;
};
