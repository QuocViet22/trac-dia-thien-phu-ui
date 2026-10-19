import ContactSection from '../../components/layout/ContactSection.tsx'
import BestSellers, { BestSellersSkeleton } from './components/BestSellers.tsx'
import CategorySection, { CategorySectionSkeleton } from './components/CategorySection.tsx'
import CategorySidebar from './components/CategorySidebar.tsx'
import FeaturedCategories, { FeaturedCategoriesSkeleton } from './components/FeaturedCategories.tsx'
import HeroSlider, { HeroSliderSkeleton } from './components/HeroSlider.tsx'
import NewsSection, { NewsSectionSkeleton } from './components/NewsSection.tsx'
import PromoCards, { PromoCardsSkeleton } from './components/PromoCards.tsx'
import ServiceBanners, { ServiceBannersSkeleton } from './components/ServiceBanners.tsx'
import { useHomepage } from './useHomepage.ts'

interface DashboardPageProps {
  sidebarOpen: boolean
}

function DashboardPage({ sidebarOpen }: DashboardPageProps) {
  const home = useHomepage()

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col lg:flex-row gap-6 relative">
        <CategorySidebar open={sidebarOpen} />
        <div className="flex-1 flex flex-col gap-4">
          {home.slides.loading ? (
            <HeroSliderSkeleton />
          ) : home.slides.failed || home.slides.data.length === 0 ? null : (
            <HeroSlider slides={home.slides.data} />
          )}
          {home.promoImages.loading ? (
            <PromoCardsSkeleton />
          ) : home.promoImages.failed || home.promoImages.data.length === 0 ? null : (
            <PromoCards images={home.promoImages.data} />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-4 flex flex-col gap-8">
        {home.featured.loading ? (
          <FeaturedCategoriesSkeleton />
        ) : home.featured.failed || home.featured.data.length === 0 ? null : (
          <FeaturedCategories items={home.featured.data} />
        )}
        {home.bestSellers.loading ? (
          <BestSellersSkeleton />
        ) : home.bestSellers.failed || home.bestSellers.data.length === 0 ? null : (
          <BestSellers products={home.bestSellers.data} />
        )}
        {home.categorySections.loading ? (
          <CategorySectionSkeleton />
        ) : home.categorySections.failed || home.categorySections.data.length === 0 ? null : (
          home.categorySections.data.map((section) => (
            <CategorySection key={section.id} {...section} />
          ))
        )}
        {home.serviceImages.loading ? (
          <ServiceBannersSkeleton />
        ) : home.serviceImages.failed || home.serviceImages.data.length === 0 ? null : (
          <ServiceBanners banners={home.serviceImages.data} />
        )}
        {home.news.loading ? (
          <NewsSectionSkeleton />
        ) : home.news.failed || home.news.data.length === 0 ? null : (
          <NewsSection items={home.news.data} />
        )}
      </div>

      <ContactSection />
    </>
  )
}

export default DashboardPage
