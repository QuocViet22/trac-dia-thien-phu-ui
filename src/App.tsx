import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
import IntroductionPage from './pages/introduction/IntroductionPage.tsx'
import SanPhamPage from './pages/san-pham/SanPhamPage.tsx'
import ProductDetailPage from './pages/san-pham/ProductDetailPage.tsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <SiteLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <Routes>
          <Route path="/" element={<DashboardPage sidebarOpen={sidebarOpen} />} />
          <Route path="/gioi-thieu" element={<IntroductionPage />} />
          <Route path="/san-pham" element={<SanPhamPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
