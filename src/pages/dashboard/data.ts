export interface Category {
  label: string
}

export interface Product {
  brand: string
  name: string
  image: string
  badge?: 'Mới' | 'Hot'
}

export const categories: Category[] = [
  { label: 'Máy GNSS RTK' },
  { label: 'Máy Thủy Bình' },
  { label: 'Máy Toàn Đạc Điện Tử' },
  { label: 'Máy Định Vị GPS Cầm Tay' },
  { label: 'Phụ Kiện Trắc Địa' },
  { label: 'Máy Cân Bằng Laser' },
  { label: 'Máy Bộ Đàm' },
  { label: 'Máy Quét Laser Scan' },
  { label: 'Máy Đo Khoảng Cách Laser' },
  { label: 'Thiết Bị Đo Điện' },
  { label: 'Thiết Bị Đo Môi Trường Và Vật Liệu' },
  { label: 'Máy Lọc Nước Robot' },
]
