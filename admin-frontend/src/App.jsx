import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManagePosts from "./pages/ManagePosts";
import ManageBookings from "./pages/ManageBookings";
import ManageReviews from "./pages/ManageReviews";
import Users from "./pages/Users";
import Providers from "./pages/Providers";
import Bookings from "./pages/Bookings";
import Revenue from "./pages/Revenue";
import BlockedUsers from "./pages/BlockedUsers";
import Approvals from "./pages/Approvals";
import ProviderRegistrations from "./pages/ProviderRegistrations";
import ProviderVerification from "./pages/ProviderVerification";
import Analytics from "./pages/Analytics";
import ProviderPayments from "./pages/ProviderPayments";
import WorkVerification from "./pages/WorkVerification";
import AdminWorkVerification from "./pages/AdminWorkVerification";
import ProviderWorkUpload from "./pages/ProviderWorkUpload";
import PaymentProcessing from "./pages/PaymentProcessing";
import PaymentSystem from "./pages/PaymentSystem";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentAnalytics from "./pages/PaymentAnalytics";
import ServiceApprovals from "./pages/ServiceApprovals";
import ServicePlacement from "./pages/ServicePlacement";
import WithdrawalApprovals from "./pages/WithdrawalApprovals";
import SupportTickets from "./pages/SupportTickets";
import ServiceHighlights from "./pages/ServiceHighlights";
import PaymentVerifications from "./pages/PaymentVerifications";
import KYCVerifications from "./pages/KYCVerifications";
import BankVerifications from "./pages/BankVerifications";
import PasswordResetApprovals from "./pages/PasswordResetApprovals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/providers" element={<Providers />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/revenue" element={<Revenue />} />
        <Route path="/admin/blocked-users" element={<BlockedUsers />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/provider-registrations" element={<ProviderRegistrations />} />
        <Route path="/admin/provider-verification" element={<ProviderVerification />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/service-approvals" element={<ServiceApprovals />} />
        <Route path="/admin/service-placement" element={<ServicePlacement />} />
        <Route path="/admin/withdrawal-approvals" element={<WithdrawalApprovals />} />
        <Route path="/admin/support-tickets" element={<SupportTickets />} />
        <Route path="/admin/service-highlights" element={<ServiceHighlights />} />
        <Route path="/admin/payment-verifications" element={<PaymentVerifications />} />
        <Route path="/admin/kyc-verifications" element={<KYCVerifications />} />
        <Route path="/admin/bank-verifications" element={<BankVerifications />} />
        <Route path="/admin/password-reset-approvals" element={<PasswordResetApprovals />} />
        
        {/* Provider Payment System Routes */}
        <Route path="/provider-payments" element={<ProviderPayments />} />
        <Route path="/work-verification" element={<WorkVerification />} />
        <Route path="/admin/work-verification" element={<AdminWorkVerification />} />
        <Route path="/provider-work-upload" element={<ProviderWorkUpload />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/payment-system" element={<PaymentSystem />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/payment-analytics" element={<PaymentAnalytics />} />
        
        {/* Legacy routes - keep for backward compatibility */}
        <Route path="/admin/services" element={<ManagePosts />} />
        <Route path="/admin/reviews" element={<ManageReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;