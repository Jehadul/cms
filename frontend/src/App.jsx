import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/companies/CompanyList";
import CompanyForm from "./pages/companies/CompanyForm";
import VendorList from "./pages/vendors/VendorList";
import VendorForm from "./pages/vendors/VendorForm";
import CustomerList from "./pages/customers/CustomerList";
import CustomerForm from "./pages/customers/CustomerForm";
import BankList from "./pages/banks/BankList";
import BankForm from "./pages/banks/BankForm";
import BranchList from "./pages/banks/BranchList";
import BranchForm from "./pages/banks/BranchForm";
import BankAccountList from "./pages/accounts/BankAccountList";
import BankAccountForm from "./pages/accounts/BankAccountForm";
import ChequeBookList from "./pages/cheques/ChequeBookList";
import ChequeBookForm from "./pages/cheques/ChequeBookForm";
import ChequeBookView from "./pages/cheques/ChequeBookView";
import IncomingChequeList from "./pages/cheques/IncomingChequeList";
import IncomingChequeForm from "./pages/cheques/IncomingChequeForm";
import PdcDashboard from "./pages/pdc/PdcDashboard";
import PrintPage from "./pages/printing/PrintPage";
import ChequeTemplateList from "./pages/templates/ChequeTemplateList";
import ChequeTemplateForm from "./pages/templates/ChequeTemplateForm";
import NotificationList from "./pages/notifications/NotificationList";
import AlertConfigForm from "./pages/notifications/AlertConfigForm";
import ApprovalDashboard from "./pages/workflow/ApprovalDashboard";
import ReportDashboard from "./pages/ReportDashboard";
import AuditLogList from "./pages/audit/AuditLogList";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/companies"
        element={
          <PrivateRoute>
            <CompanyList />
          </PrivateRoute>
        }
      />
      <Route
        path="/companies/add"
        element={
          <PrivateRoute>
            <CompanyForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/companies/edit/:id"
        element={
          <PrivateRoute>
            <CompanyForm />
          </PrivateRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendors"
        element={
          <PrivateRoute>
            <VendorList />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendors/add"
        element={
          <PrivateRoute>
            <VendorForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendors/edit/:id"
        element={
          <PrivateRoute>
            <VendorForm />
          </PrivateRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <CustomerList />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers/add"
        element={
          <PrivateRoute>
            <CustomerForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers/edit/:id"
        element={
          <PrivateRoute>
            <CustomerForm />
          </PrivateRoute>
        }
      />

      {/* Bank Routes */}
      <Route
        path="/banks"
        element={
          <PrivateRoute>
            <BankList />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks/add"
        element={
          <PrivateRoute>
            <BankForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks/edit/:id"
        element={
          <PrivateRoute>
            <BankForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks/:bankId/branches"
        element={
          <PrivateRoute>
            <BranchList />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks/:bankId/branches/add"
        element={
          <PrivateRoute>
            <BranchForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks/:bankId/branches/edit/:id"
        element={
          <PrivateRoute>
            <BranchForm />
          </PrivateRoute>
        }
      />

      {/* Bank Account Routes */}
      <Route
        path="/accounts"
        element={
          <PrivateRoute>
            <BankAccountList />
          </PrivateRoute>
        }
      />
      <Route
        path="/accounts/add"
        element={
          <PrivateRoute>
            <BankAccountForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/accounts/edit/:id"
        element={
          <PrivateRoute>
            <BankAccountForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/cheque-books"
        element={
          <PrivateRoute>
            <ChequeBookList />
          </PrivateRoute>
        }
      />
      <Route
        path="/cheque-books/add"
        element={
          <PrivateRoute>
            <ChequeBookForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/cheque-books/:id/view"
        element={
          <PrivateRoute>
            <ChequeBookView />
          </PrivateRoute>
        }
      />

      <Route
        path="/incoming-cheques"
        element={
          <PrivateRoute>
            <IncomingChequeList />
          </PrivateRoute>
        }
      />

      <Route
        path="/incoming-cheques/add"
        element={
          <PrivateRoute>
            <IncomingChequeForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/pdc"
        element={
          <PrivateRoute>
            <PdcDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/cheque-printing"
        element={
          <PrivateRoute>
            <PrintPage />
          </PrivateRoute>
        }
      />

      {/* Template Routes */}
      <Route
        path="/templates"
        element={
          <PrivateRoute>
            <ChequeTemplateList />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/add"
        element={
          <PrivateRoute>
            <ChequeTemplateForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/edit/:id"
        element={
          <PrivateRoute>
            <ChequeTemplateForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationList />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications/config"
        element={
          <PrivateRoute>
            <AlertConfigForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/approvals"
        element={
          <PrivateRoute>
            <ApprovalDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <PrivateRoute>
            <AuditLogList />
          </PrivateRoute>
        }
      />

      {/* Helper routes for empty links */}
      <Route path="/cheques" element={<PrivateRoute><div>Cheques Module Coming Soon</div></PrivateRoute>} />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <ReportDashboard />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
