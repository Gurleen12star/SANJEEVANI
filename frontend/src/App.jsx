import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FarmerProvider } from './context/FarmerContext'
import LandingPage from './LandingPage'
import LoginPage from './LoginPage'
import FarmerDashboard from './farmer/FarmerDashboard'
import CropScanner from './farmer/CropScanner'
import FPOVouching from './farmer/FPOVouching'
import LoanRequest from './farmer/LoanRequest'
import SelectiveDisclosure from './farmer/SelectiveDisclosure'
import LoanStatus from './farmer/LoanStatus'
import VoiceAssistant from './components/VoiceAssistant'
import TrustToast from './components/TrustToast'

// FPO Mode
import FPODashboard from './fpo/FPODashboard'
import ApplicationReview from './fpo/ApplicationReview'

function App() {
  return (
    <Router>
      <FarmerProvider>
        <VoiceAssistant />
        <TrustToast />
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Farmer Mode */}
            <Route path="/farmer/dashboard"  element={<FarmerDashboard />} />
            <Route path="/farmer/scan"       element={<CropScanner />} />
            <Route path="/farmer/vouch"      element={<FPOVouching />} />
            <Route path="/farmer/loan"       element={<LoanRequest />} />
            <Route path="/farmer/disclose"   element={<SelectiveDisclosure />} />
            <Route path="/farmer/status"     element={<LoanStatus />} />

            {/* FPO Mode */}
            <Route path="/fpo/dashboard"     element={<FPODashboard />} />
            <Route path="/fpo/review/:id"    element={<ApplicationReview />} />
          </Routes>
        </div>
      </FarmerProvider>
    </Router>
  )
}

export default App
