
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import TokenCostDashboard from "./pages/TokenCostDashboard";
import ChatsDashboard from "./pages/ChatsDashboard";
import KnowledgeManager from "./pages/KnowledgeManager";
import ClientsDashboard from "./pages/ClientsDashboard";
import Evolution from "./pages/Evolution";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import ProductsManager from "./pages/ProductsManager";
import PaymentsManager from "./pages/PaymentsManager";
import UsersManager from "./pages/UsersManager";
import ConfigManager from "./pages/ConfigManager";
import GoogleAuth from "./pages/GoogleAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/metrics" element={
                <ProtectedRoute requiredPermission="canAccessMetrics">
                  <MetricsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/token-cost" element={
                <ProtectedRoute requiredPermission="canAccessTokenCost">
                  <TokenCostDashboard />
                </ProtectedRoute>
              } />
              <Route path="/chats" element={
                <ProtectedRoute requiredPermission="canAccessChats">
                  <ChatsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/knowledge" element={
                <ProtectedRoute requiredPermission="canAccessKnowledge">
                  <KnowledgeManager />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute requiredPermission="canAccessClients">
                  <ClientsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/evolution" element={
                <ProtectedRoute requiredPermission="canAccessEvolution">
                  <Evolution />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute requiredPermission="canAccessSchedule">
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute requiredPermission="canAccessProducts">
                  <ProductsManager />
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute requiredPermission="canAccessPayments">
                  <PaymentsManager />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredPermission="canAccessUsers">
                  <UsersManager />
                </ProtectedRoute>
              } />
              <Route path="/config" element={
                <ProtectedRoute requiredPermission="canAccessConfig">
                  <ConfigManager />
                </ProtectedRoute>
              } />
              <Route path="/google-auth" element={
                <ProtectedRoute requiredPermission="canAccessConfig">
                  <GoogleAuth />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
