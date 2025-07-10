import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVerification";
import PhoneCollection from "./pages/PhoneCollection";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/Chatpage";
import UserInfoPage from "./pages/UserInfoPage";
import ProfileUpload from "./pages/ProfileUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/phone-collection" element={<PhoneCollection />} />
          <Route path="/profile-upload" element={<ProfileUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/chat/:conversationId" element={<ChatPage />} />
           <Route path="/user/:id" element={<UserInfoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
