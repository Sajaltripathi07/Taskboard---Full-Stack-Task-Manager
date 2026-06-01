
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute() {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
