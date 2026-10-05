import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
import IntroductionPage from './pages/introduction/IntroductionPage.tsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <SiteLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <Routes>
          <Route path="/" element={<DashboardPage sidebarOpen={sidebarOpen} />} />
          <Route path="/gioi-thieu" element={<IntroductionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
