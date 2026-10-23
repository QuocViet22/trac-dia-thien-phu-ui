import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
import IntroductionPage from './pages/introduction/IntroductionPage.tsx'
import ContactPage from './pages/contact/ContactPage.tsx'
import PrivacyPolicy from './pages/privacy_policy/PrivacyPolicy.tsx'
import TermsOfUse from './pages/terms_of_use/TermsOfUse.tsx'
import PurchaseGuide from './pages/purchase_guide/PurchaseGuide.tsx'
import NewsPage from './pages/news/NewsPage.tsx'
import NewsDetailPage from './pages/news/NewsDetailPage.tsx'
import CustomerList from './pages/customer/CustomerList.tsx'
import SanPhamPage from './pages/product/SanPhamPage.tsx'
import ProductDetailPage from './pages/product/ProductDetailPage.tsx'

import { useEffect } from "react"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
    <ScrollToTop />
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
          <Route path="/sua-chua-va-kiem-dinh" element={<NewsPage newsType="REPAIR_AND_INSPECTION_NEWS" title="Sửa chữa & Kiểm định" emptyText="Chưa có tin tức sửa chữa & kiểm định nào." basePath="/sua-chua-va-kiem-dinh" />} />
          <Route path="/sua-chua-va-kiem-dinh/:slug" element={<NewsDetailPage newsType="REPAIR_AND_INSPECTION_NEWS" listTitle="Sửa chữa & Kiểm định" listPath="/sua-chua-va-kiem-dinh" />} />
          <Route path="/khach-hang" element={<CustomerList />} />
          <Route path="/khach-hang/:slug" element={<NewsDetailPage newsType="CUSTOMER_NEWS" listTitle="Khách hàng" listPath="/khach-hang" />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
          <Route path="/dieu-khoan-su-dung" element={<TermsOfUse />} />
          <Route path="/huong-dan-mua-hang" element={<PurchaseGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
