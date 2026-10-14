export interface Category {
  icon: string
  label: string
}

export interface Product {
  brand: string
  name: string
  image: string
  badge?: 'Mới' | 'Hot'
}

export const categories: Category[] = [
  { icon: 'fa-solid fa-satellite-dish', label: 'Máy GNSS RTK' },
  { icon: 'fa-solid fa-level-down-alt', label: 'Máy Thủy Bình' },
  { icon: 'fa-solid fa-camera-retro', label: 'Máy Toàn Đạc Điện Tử' },
  { icon: 'fa-solid fa-mobile-alt', label: 'Máy Định Vị GPS Cầm Tay' },
  { icon: 'fa-solid fa-tools', label: 'Phụ Kiện Trắc Địa' },
  { icon: 'fa-solid fa-ruler-combined', label: 'Máy Cân Bằng Laser' },
  { icon: 'fa-solid fa-walkie-talkie', label: 'Máy Bộ Đàm' },
  { icon: 'fa-solid fa-print', label: 'Máy Quét Laser Scan' },
  { icon: 'fa-solid fa-ruler-horizontal', label: 'Máy Đo Khoảng Cách Laser' },
  { icon: 'fa-solid fa-plug', label: 'Thiết Bị Đo Điện' },
  { icon: 'fa-solid fa-leaf', label: 'Thiết Bị Đo Môi Trường Và Vật Liệu' },
  { icon: 'fa-solid fa-faucet-drip', label: 'Máy Lọc Nước Robot' },
]

const FALLBACK_CATEGORY_ICON = 'fa-solid fa-cube'

export function categoryIcon(name: string): string {
  const key = name.trim().toLowerCase()
  return categories.find((cat) => cat.label.toLowerCase() === key)?.icon ?? FALLBACK_CATEGORY_ICON
}
