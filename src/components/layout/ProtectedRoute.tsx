import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || !!localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
