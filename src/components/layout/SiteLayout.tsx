import type { ReactNode } from 'react'
import FloatingButtons from './FloatingButtons.tsx'
import Footer from './Footer.tsx'
import Header from './Header.tsx'
import MainNav from './MainNav.tsx'

interface SiteLayoutProps {
  children: ReactNode
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function SiteLayout({ children, sidebarOpen, onToggleSidebar }: SiteLayoutProps) {
  return (
    <div className="bg-[#f8f9fa] text-gray-800 antialiased">
      <Header />
      <MainNav sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}

export default SiteLayout
