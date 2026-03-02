import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

export function ProtectedRoute() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Optional: Check for admin role specifically if needed
    if (user.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

