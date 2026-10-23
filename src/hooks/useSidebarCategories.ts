import { useEffect, useState } from 'react'
import {
  listCategories,
  listCollections,
  type CategoryResponse,
  type CollectionResponse,
} from '../lib/api.ts'

export interface SidebarCategoriesState {
  categories: CategoryResponse[]
  loading: boolean
  failed: boolean
}

function joinSidebar(
  collections: CollectionResponse[],
  categories: CategoryResponse[],
): CategoryResponse[] {
  const byId = new Map(categories.map((category) => [category.id, category]))
  const seen = new Set<string>()
  return [...collections]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((collection) => {
      const referenceId = collection.referenceId
      if (!referenceId || seen.has(referenceId)) {
        return []
      }
      const category = byId.get(referenceId)
      if (!category) {
        return []
      }
      seen.add(referenceId)
      return [category]
    })
}

export function useSidebarCategories(enabled = true): SidebarCategoriesState {
  const [state, setState] = useState<SidebarCategoriesState>({
    categories: [],
    loading: true,
    failed: false,
  })

  useEffect(() => {
    if (!enabled) {
      return
    }
    let cancelled = false
    Promise.all([
      listCollections('CATEGORY_SIDEBAR_COLLECTION'),
      listCategories(),
    ])
      .then(([collections, categories]) => {
        if (!cancelled) {
          setState({
            categories: joinSidebar(collections, categories),
            loading: false,
            failed: false,
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ categories: [], loading: false, failed: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return state
}
