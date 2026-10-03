import { useState } from 'react'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SiteLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
      <DashboardPage sidebarOpen={sidebarOpen} />
    </SiteLayout>
  )
}

export default App
