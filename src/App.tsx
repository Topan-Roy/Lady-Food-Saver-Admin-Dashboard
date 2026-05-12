import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { OrdersTransactions } from './pages/OrdersTransactions';
import { Analytics } from './pages/Analytics';
import { Support } from './pages/Support';
import { Compliance } from './pages/Compliance';
import { Settings } from './pages/Settings';
import { CustomerDetail } from './pages/CustomerDetail';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { OrderDetail } from './pages/OrderDetail';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicRoute } from './components/layout/PublicRoute';
import { TaxRules } from './pages/TaxRules';
import { LegalDocuments } from './pages/LegalDocuments';
import { ProfilePage } from './pages/ProfilePage';
import { Notifications } from './pages/Notifications';
import { PromotionalBanners } from './pages/PromotionalBanners';
import { Donations } from './pages/Donations';

export function App() {
  return <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/customer/:id" element={<CustomerDetail />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/orders" element={<OrdersTransactions />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/banners" element={<PromotionalBanners />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/support" element={<Support />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tax-info" element={<TaxRules />} />
        <Route path="/legal-documents" element={<LegalDocuments />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>;
}