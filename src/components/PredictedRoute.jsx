// Auth removed — all routes are publicly accessible.
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  return <Outlet />;
}
