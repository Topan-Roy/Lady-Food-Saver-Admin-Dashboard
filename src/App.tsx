import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
export function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/customer/:id" element={<CustomerDetail />} />
      <Route path="/users/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/orders" element={<OrdersTransactions />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/support" element={<Support />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Router>;
}