import { useState } from 'react'
import { listProducts, type ProductResponse } from '../lib/api.ts'

export type CategoryProducts = ProductResponse[] | 'failed'

/** Hover state and product cache shared by the nav dropdown and the home sidebar. */
export function useCategoryFlyout() {
  const [flyoutId, setFlyoutId] = useState<string | null>(null)
  const [flyoutData, setFlyoutData] = useState<Record<string, CategoryProducts>>({})

  const openFlyout = (id: string) => {
    setFlyoutId(id)
    if (flyoutData[id] !== undefined) {
      return
    }
    listProducts({ page: 0, size: 10, categoryId: id, sort: 'createdAt,desc' })
      .then((data) => {
        setFlyoutData((current) => ({ ...current, [id]: data.content }))
      })
      .catch(() => {
        setFlyoutData((current) => ({ ...current, [id]: 'failed' }))
      })
  }

  const closeFlyout = () => {
    setFlyoutId(null)
  }

  return { flyoutId, flyoutData, openFlyout, closeFlyout }
}
