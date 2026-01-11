import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardHome from "./pages/DashboardHome";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import CasesPage from "./pages/CasesPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import FinancePage from "./pages/FinancePage";
import InventoryPage from "./pages/InventoryPage";
import EmployeesPage from "./pages/EmployeesPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:caseId" element={<CaseDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  </>
);

export default App;
