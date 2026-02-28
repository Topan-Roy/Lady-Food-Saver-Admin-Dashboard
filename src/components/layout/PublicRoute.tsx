import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

export function PublicRoute() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (isAuthenticated && user?.role === 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
