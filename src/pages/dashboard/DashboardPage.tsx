import BestSellers from './components/BestSellers.tsx'
import CategorySection from './components/CategorySection.tsx'
import CategorySidebar from './components/CategorySidebar.tsx'
import FeaturedCategories from './components/FeaturedCategories.tsx'
import HeroSlider from './components/HeroSlider.tsx'
import NewsSection from './components/NewsSection.tsx'
import PromoCards from './components/PromoCards.tsx'
import ServiceBanners from './components/ServiceBanners.tsx'
import { categorySections, slides } from './data.ts'

interface DashboardPageProps {
  sidebarOpen: boolean
}

function DashboardPage({ sidebarOpen }: DashboardPageProps) {
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col lg:flex-row gap-6 relative">
        <CategorySidebar open={sidebarOpen} />
        <div className="flex-1 flex flex-col gap-4">
          <HeroSlider slides={slides} />
          <PromoCards />
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-4 flex flex-col gap-8">
        <FeaturedCategories />
        <BestSellers />
        {categorySections.map((section) => (
          <CategorySection key={section.id} {...section} />
        ))}
        <ServiceBanners />
        <NewsSection />
      </div>
    </>
  )
}

export default DashboardPage
