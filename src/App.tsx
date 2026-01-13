import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Auth Protection
import RoleGuard from "@/components/auth/RoleGuard";
import ScrollToTop from "@/components/shared/ScrollToTop";

// Public Pages
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ForCarers from "./pages/ForCarers";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Careers from "./pages/public/Careers";
import Security from "./pages/public/Security";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import UserGuide from "./pages/public/UserGuide";
import SafetyGuidelines from "./pages/public/SafetyGuidelines";
import Blog from "./pages/public/Blog";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ClientSignup from "./pages/auth/ClientSignup";
import CarerSignup from "./pages/auth/CarerSignup";
import OrganisationSignup from "./pages/auth/OrganisationSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import SearchCarers from "./pages/client/SearchCarers";
import SearchEnhanced from "./pages/client/SearchEnhanced";
import ClientBookings from "./pages/client/Bookings";
import CreateBooking from "./pages/client/CreateBooking";
import CarePlans from "./pages/client/CarePlans";
import ClientMessages from "./pages/client/Messages";
import ClientPayments from "./pages/client/Payments";
import ClientProfile from "./pages/client/Profile";
import ClientSettings from "./pages/client/Settings";

// Shared Pages
import Help from "./pages/shared/Help";

// Carer Pages
import CarerDashboard from "./pages/carer/Dashboard";
import CarerAvailability from "./pages/carer/Availability";
import CarerBookings from "./pages/carer/BookingsEnhanced";
import CarerEarnings from "./pages/carer/Earnings";
import EarningsEnhanced from "./pages/carer/EarningsEnhanced";
import CarerDocuments from "./pages/carer/Documents";
import DocumentsNew from "./pages/carer/DocumentsNew";
import CarerProfile from "./pages/carer/Profile";
import ProfileEnhanced from "./pages/carer/ProfileEnhanced";

// Organisation Pages
import OrganisationDashboard from "./pages/organisation/Dashboard";
import OrganisationStaff from "./pages/organisation/Staff";
import OrganisationJobs from "./pages/organisation/Jobs";
import OrganisationBookings from "./pages/organisation/Bookings";
import OrganisationCompliance from "./pages/organisation/Compliance";
import OrganisationAnalytics from "./pages/organisation/Analytics";
import OrganisationSettings from "./pages/organisation/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVerifications from "./pages/admin/Verifications";
import VerificationsEnhanced from "./pages/admin/VerificationsEnhanced";
import AdminOrganisations from "./pages/admin/Organisations";
import AdminReports from "./pages/admin/Reports";
import PhaseControl from "./pages/admin/PhaseControl";
import SystemLogs from "./pages/admin/SystemLogs";
import Settings from "./pages/admin/Settings";
import Disputes from "./pages/admin/Disputes";
import AdminProfile from "./pages/admin/Profile";
import AdminCarers from "./pages/admin/Carers";
import AdminBookings from "./pages/admin/Bookings";
import AdminBlogManagement from "./pages/admin/BlogManagement";

// Shared Pages
import MessagesPage from "./pages/shared/Messages";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/carers" element={<ForCarers />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* New Public Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
            <Route path="/blog" element={<Blog />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/client" element={<ClientSignup />} />
            <Route path="/signup/carer" element={<CarerSignup />} />
            <Route path="/signup/organisation" element={<OrganisationSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Client Routes - Protected for 'client' role only */}
            <Route path="/client/dashboard" element={
              <RoleGuard allowedRoles={['client', 'organisation']}>
                <ClientDashboard />
              </RoleGuard>
            } />
            <Route path="/client/search" element={
              <RoleGuard allowedRoles={['client', 'organisation']}>
                <SearchCarers />
              </RoleGuard>
            } />
            <Route path="/client/search-enhanced" element={
              <RoleGuard allowedRoles={['client', 'organisation']}>
                <SearchEnhanced />
              </RoleGuard>
            } />
            <Route path="/client/bookings" element={
              <RoleGuard allowedRoles={['client']}>
                <ClientBookings />
              </RoleGuard>
            } />
            <Route path="/client/book/:carerId" element={
              <RoleGuard allowedRoles={['client', 'organisation']}>
                <CreateBooking />
              </RoleGuard>
            } />
            <Route path="/client/care-plans" element={
              <RoleGuard allowedRoles={['client']}>
                <CarePlans />
              </RoleGuard>
            } />
            <Route path="/client/messages" element={
              <RoleGuard allowedRoles={['client']}>
                <MessagesPage role="client" />
              </RoleGuard>
            } />
            <Route path="/client/payments" element={
              <RoleGuard allowedRoles={['client']}>
                <ClientPayments />
              </RoleGuard>
            } />
            <Route path="/client/profile" element={
              <RoleGuard allowedRoles={['client']}>
                <ClientProfile />
              </RoleGuard>
            } />
            <Route path="/client/settings" element={
              <RoleGuard allowedRoles={['client']}>
                <ClientSettings />
              </RoleGuard>
            } />

            {/* Shared Routes */}
            <Route path="/help" element={<Help />} />

            {/* Carer Routes - Protected for 'carer' role only */}
            <Route path="/carer/dashboard" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerDashboard />
              </RoleGuard>
            } />
            <Route path="/carer/availability" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerAvailability />
              </RoleGuard>
            } />
            <Route path="/carer/bookings" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerBookings />
              </RoleGuard>
            } />
            <Route path="/carer/earnings" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerEarnings />
              </RoleGuard>
            } />
            <Route path="/carer/earnings-enhanced" element={
              <RoleGuard allowedRoles={['carer']}>
                <EarningsEnhanced />
              </RoleGuard>
            } />
            <Route path="/carer/documents" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerDocuments />
              </RoleGuard>
            } />
            <Route path="/carer/verification" element={
              <RoleGuard allowedRoles={['carer']}>
                <DocumentsNew />
              </RoleGuard>
            } />
            <Route path="/carer/profile" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerProfile />
              </RoleGuard>
            } />
            <Route path="/carer/profile-enhanced" element={
              <RoleGuard allowedRoles={['carer']}>
                <ProfileEnhanced />
              </RoleGuard>
            } />
            <Route path="/carer/messages" element={
              <RoleGuard allowedRoles={['carer']}>
                <MessagesPage role="carer" />
              </RoleGuard>
            } />
            <Route path="/carer/settings" element={
              <RoleGuard allowedRoles={['carer']}>
                <CarerProfile />
              </RoleGuard>
            } />

            {/* Organisation Routes - Protected for 'organisation' role only */}
            <Route path="/organisation/dashboard" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationDashboard />
              </RoleGuard>
            } />
            <Route path="/organisation/staff" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationStaff />
              </RoleGuard>
            } />
            <Route path="/organisation/jobs" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationJobs />
              </RoleGuard>
            } />
            <Route path="/organisation/bookings" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationBookings />
              </RoleGuard>
            } />
            <Route path="/organisation/compliance" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationCompliance />
              </RoleGuard>
            } />
            <Route path="/organisation/analytics" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationAnalytics />
              </RoleGuard>
            } />
            <Route path="/organisation/profile" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationDashboard />
              </RoleGuard>
            } />
            <Route path="/organisation/messages" element={
              <RoleGuard allowedRoles={['organisation']}>
                <MessagesPage role="organisation" />
              </RoleGuard>
            } />
            <Route path="/organisation/settings" element={
              <RoleGuard allowedRoles={['organisation']}>
                <OrganisationSettings />
              </RoleGuard>
            } />

            {/* Admin Routes - Protected for 'admin' role only */}
            <Route path="/admin/dashboard" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            } />
            <Route path="/admin/users" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminUsers />
              </RoleGuard>
            } />
            <Route path="/admin/verifications" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminVerifications />
              </RoleGuard>
            } />
            <Route path="/admin/verification-queue" element={
              <RoleGuard allowedRoles={['admin']}>
                <VerificationsEnhanced />
              </RoleGuard>
            } />
            <Route path="/admin/organisations" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminOrganisations />
              </RoleGuard>
            } />
            <Route path="/admin/reports" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminReports />
              </RoleGuard>
            } />
            <Route path="/admin/phase-control" element={
              <RoleGuard allowedRoles={['admin']}>
                <PhaseControl />
              </RoleGuard>
            } />
            <Route path="/admin/messages" element={
              <RoleGuard allowedRoles={['admin']}>
                <MessagesPage role="admin" />
              </RoleGuard>
            } />
            <Route path="/admin/system-logs" element={
              <RoleGuard allowedRoles={['admin']}>
                <SystemLogs />
              </RoleGuard>
            } />
            <Route path="/admin/settings" element={
              <RoleGuard allowedRoles={['admin']}>
                <Settings />
              </RoleGuard>
            } />
            <Route path="/admin/disputes" element={
              <RoleGuard allowedRoles={['admin']}>
                <Disputes />
              </RoleGuard>
            } />
            <Route path="/admin/profile" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminProfile />
              </RoleGuard>
            } />
            <Route path="/admin/carers" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminCarers />
              </RoleGuard>
            } />
            <Route path="/admin/bookings" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminBookings />
              </RoleGuard>
            } />
            <Route path="/admin/blog" element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminBlogManagement />
              </RoleGuard>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
