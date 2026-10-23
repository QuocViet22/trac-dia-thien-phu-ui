import { useEffect, useState } from 'react'
import {
  getCategory,
  getNews,
  getProduct,
  listCategories,
  listCollections,
  listProducts,
  type CategoryResponse,
  type CollectionResponse,
  type NewsResponse,
  type ProductResponse,
} from '../../lib/api.ts'

export interface SlideData {
  id: string
  image: string
  alt: string
}

export interface FeaturedData {
  id: string
  name: string
  imageUrl: string
}

export interface CategorySectionData {
  id: string
  categoryId: string
  seoAlias: string | null
  title: string
  brands: string[]
  products: ProductResponse[]
}

export interface SectionState<T> {
  data: T
  loading: boolean
  failed: boolean
}

export interface HomepageData {
  slides: SectionState<SlideData[]>
  promoImages: SectionState<SlideData[]>
  serviceImages: SectionState<SlideData[]>
  featured: SectionState<FeaturedData[]>
  bestSellers: SectionState<ProductResponse[]>
  categorySections: SectionState<CategorySectionData[]>
  news: SectionState<NewsResponse[]>
}

function firstImageUrl(images: { imageUrl: string }[]): string {
  return images.length > 0 ? images[0].imageUrl : ''
}

function ok<T>(data: T): SectionState<T> {
  return { data, loading: false, failed: false }
}

export function useHomepage(): HomepageData {
  const [collections, setCollections] = useState<Record<string, CollectionResponse[]> | null>(null)
  const [failedTypes, setFailedTypes] = useState<Set<string>>(new Set())
  const [resolved, setResolved] = useState<Omit<HomepageData, 'slides' | 'promoImages' | 'serviceImages'> | null>(null)
  const [resolveFailed, setResolveFailed] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    const types = [
      'HERO_SLIDER_COLLECTION',
      'PROMO_CARD_COLLECTION',
      'FEATURED_CATEGORY_COLLECTION',
      'BEST_SELLER_COLLECTION',
      'CATEGORY_COLLECTION',
      'SERVICE_BANNER_COLLECTION',
      'NEWS_COLLECTION',
    ] as const
    Promise.all(
      types.map((type) =>
        listCollections(type).then(
          (data) => ({ type, data }),
          () => ({ type, data: null }),
        ),
      ),
    ).then((results) => {
      if (cancelled) return
      const grouped: Record<string, CollectionResponse[]> = {}
      const failed = new Set<string>()
      for (const { type, data } of results) {
        if (data === null) {
          failed.add(type)
          grouped[type] = []
        } else {
          grouped[type] = data
        }
      }
      setCollections(grouped)
      setFailedTypes(failed)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (collections === null) return
    const grouped: Record<string, CollectionResponse[]> = collections
    let cancelled = false
    async function resolve(): Promise<void> {
      const failed = new Set<string>()
      const bestSellerCols = grouped['BEST_SELLER_COLLECTION'] ?? []
      const bestSellers = (
        await Promise.all(
          bestSellerCols.map((c) =>
            c.referenceId ? getProduct(c.referenceId).catch(() => null) : Promise.resolve(null),
          ),
        )
      ).filter((p): p is ProductResponse => p !== null)

      let categories: CategoryResponse[] = []
      try {
        categories = await listCategories()
      } catch {
        failed.add('FEATURED_CATEGORY_COLLECTION')
        failed.add('CATEGORY_COLLECTION')
      }
      const byId = new Map(categories.map((c) => [c.id, c]))
      const featured: FeaturedData[] = []
      for (const c of grouped['FEATURED_CATEGORY_COLLECTION'] ?? []) {
        let cat = c.referenceId ? byId.get(c.referenceId) : undefined
        if (!cat && c.referenceId) {
          try {
            cat = await getCategory(c.referenceId)
          } catch {
            cat = undefined
          }
        }
        if (cat) featured.push({ id: cat.id, name: cat.name, imageUrl: firstImageUrl(cat.images) })
      }

      const categorySections: CategorySectionData[] = []
      for (const c of grouped['CATEGORY_COLLECTION'] ?? []) {
        if (!c.referenceId) continue
        try {
          const page = await listProducts({ page: 0, size: 5, categoryId: c.referenceId })
          const brands = [...new Set(page.content.map((p) => p.brand).filter((b): b is string => b !== null && b !== ''))]
          categorySections.push({ id: c.id, categoryId: c.referenceId, seoAlias: byId.get(c.referenceId)?.seoAlias ?? null, title: c.name, brands, products: page.content })
        } catch {
          continue
        }
      }

      const newsItems = (
        await Promise.all(
          (grouped['NEWS_COLLECTION'] ?? []).map((c) =>
            c.referenceId ? getNews(c.referenceId).catch(() => null) : Promise.resolve(null),
          ),
        )
      ).filter((n): n is NewsResponse => n !== null)

      if (cancelled) return
      setResolved({ featured: ok(featured), bestSellers: ok(bestSellers), categorySections: ok(categorySections), news: ok(newsItems) })
      setResolveFailed(failed)
    }
    void resolve()
    return () => {
      cancelled = true
    }
  }, [collections])

  const sliderCols = collections?.['HERO_SLIDER_COLLECTION'] ?? []
  const promoCols = collections?.['PROMO_CARD_COLLECTION'] ?? []
  const serviceCols = collections?.['SERVICE_BANNER_COLLECTION'] ?? []
  const loading = collections === null || resolved === null

  return {
    slides: {
      data: sliderCols
        .map((c) => ({ id: c.id, image: firstImageUrl(c.images), alt: c.name }))
        .filter((s) => s.image !== ''),
      loading,
      failed: failedTypes.has('HERO_SLIDER_COLLECTION'),
    },
    promoImages: {
      data: promoCols
        .map((c) => ({ id: c.id, image: firstImageUrl(c.images), alt: c.name }))
        .filter((s) => s.image !== ''),
      loading,
      failed: failedTypes.has('PROMO_CARD_COLLECTION'),
    },
    serviceImages: {
      data: serviceCols
        .map((c) => ({ id: c.id, image: firstImageUrl(c.images), alt: c.name }))
        .filter((s) => s.image !== ''),
      loading,
      failed: failedTypes.has('SERVICE_BANNER_COLLECTION'),
    },
    featured: resolved?.featured ?? { data: [], loading, failed: failedTypes.has('FEATURED_CATEGORY_COLLECTION') || resolveFailed.has('FEATURED_CATEGORY_COLLECTION') },
    bestSellers: resolved?.bestSellers ?? { data: [], loading, failed: failedTypes.has('BEST_SELLER_COLLECTION') },
    categorySections: resolved?.categorySections ?? { data: [], loading, failed: failedTypes.has('CATEGORY_COLLECTION') || resolveFailed.has('CATEGORY_COLLECTION') },
    news: resolved?.news ?? { data: [], loading, failed: failedTypes.has('NEWS_COLLECTION') },
  }
}
