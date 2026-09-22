import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ReportPotholePage from "./pages/ReportPotholePage";
import TrackComplaintPage from "./pages/TrackComplaintPage";
import CitizenDashboardPage from "./pages/CitizenDashboardPage";
import PotholeDetailsPage from "./pages/PotholeDetailsPage";
import PotholeMapPage from "./pages/PotholeMapPage";
import AIVerificationPage from "./pages/AIVerificationPage";
import BeforeAfterComparisonPage from "./pages/BeforeAfterComparisonPage";
import ContractorDashboardPage from "./pages/ContractorDashboardPage";
import AboutUsPage from "./pages/AboutUsPage";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportPotholePage />} />
              <Route path="/track" element={<TrackComplaintPage />} />
              <Route path="/dashboard" element={<CitizenDashboardPage />} />
              <Route path="/details/:id" element={<PotholeDetailsPage />} />
              <Route path="/map" element={<PotholeMapPage />} />
              <Route path="/verify-results/:id" element={<AIVerificationPage />} />
              <Route path="/compare/:id" element={<BeforeAfterComparisonPage />} />
              <Route path="/contractor" element={<ContractorDashboardPage />} />
              <Route path="/about" element={<AboutUsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
