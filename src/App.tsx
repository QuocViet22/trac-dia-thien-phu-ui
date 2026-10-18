import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
import IntroductionPage from './pages/introduction/IntroductionPage.tsx'
import ContactPage from './pages/contact/ContactPage.tsx'
import NewsPage from './pages/news/NewsPage.tsx'
import NewsDetailPage from './pages/news/NewsDetailPage.tsx'
import SanPhamPage from './pages/product/SanPhamPage.tsx'
import ProductDetailPage from './pages/product/ProductDetailPage.tsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <SiteLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <Routes>
          <Route path="/" element={<DashboardPage sidebarOpen={sidebarOpen} />} />
          <Route path="/gioi-thieu" element={<IntroductionPage />} />
          <Route path="/san-pham" element={<SanPhamPage />} />
          <Route path="/danh-muc/:alias" element={<SanPhamPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/tin-tuc" element={<NewsPage newsType="NEWS" title="Tất cả tin tức" emptyText="Chưa có tin tức nào." basePath="/tin-tuc" />} />
          <Route path="/tin-tuc/:slug" element={<NewsDetailPage newsType="NEWS" listTitle="Tất cả tin tức" listPath="/tin-tuc" />} />
          <Route path="/thue-san-pham" element={<NewsPage newsType="HIRING_PRODUCT" title="Thuê sản phẩm" emptyText="Chưa có sản phẩm cho thuê nào." basePath="/thue-san-pham" />} />
          <Route path="/thue-san-pham/:slug" element={<NewsDetailPage newsType="HIRING_PRODUCT" listTitle="Thuê sản phẩm" listPath="/thue-san-pham" />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
