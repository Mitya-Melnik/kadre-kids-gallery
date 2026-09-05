import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Kindergarten from "./pages/Kindergarten";
import School from "./pages/School";
import NotFound from "./pages/NotFound";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PersonalDataConsent from "./pages/PersonalDataConsent";
import AnalyticsConsent from "./components/AnalyticsConsent";

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsConsent />
        <ScrollToTopOnRouteChange />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kindergarten" element={<Kindergarten />} />
          <Route path="/school" element={<School />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/personal-data-consent" element={<PersonalDataConsent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
