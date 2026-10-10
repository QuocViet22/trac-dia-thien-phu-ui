import type { Product } from '../dashboard/data.ts'

export const brands: string[] = [
  'Hi-Target',
  'Sokkia',
  'Topcon',
  'Garmin',
  'Leica',
  'Nikon',
  'Precise',
  'E-Survey',
]

export const priceRanges: string[] = [
  'Giá dưới 100.000đ',
  '100.000đ - 200.000đ',
  '200.000đ - 300.000đ',
  '300.000đ - 500.000đ',
  '500.000đ - 1.000.000đ',
  'Giá trên 1.000.000đ',
]

export const categories: string[] = [
  'Máy GNSS RTK',
  'Máy Thủy Bình',
  'Máy Toàn Đạc Điện Tử',
  'Máy Định Vị GPS Cầm Tay',
  'Phụ Kiện Trắc Địa',
  'Máy Cân Bằng Laser',
  'Máy Bộ Đàm',
  'Máy Đo Khoảng Cách Laser',
  'Thiết Bị Đo Điện',
  'Máy Quét Laser Scan',
]

export const sortOptions: string[] = [
  'Hàng mới',
  'Giá thấp đến cao',
  'Giá cao xuống thấp',
]

export const products: Product[] = [
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-65', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-62', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Topcon', name: 'Máy cân bằng laser xoay Topcon RL-H5A', image: 'https://igeostore.vn/storage/topcon-rl-h5a-34714-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin Montana 710', image: 'https://igeostore.vn/storage/may-gps-garmin-montana-710-276x276.jpg', badge: 'Mới' },
  { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V600L', image: 'https://igeostore.vn/storage/hi-target-v600l-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị cầm tay Garmin GPSMap H1', image: 'https://igeostore.vn/storage/garmin-gpsmap-h1-1-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B20', image: 'https://igeostore.vn/storage/may-thuy-binh-sokkia-b20-2-276x276.jpg' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin 65S', image: 'https://igeostore.vn/storage/garmin-65s-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B30A', image: 'https://igeostore.vn/storage/sokkia-b30a-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B40A (4)', image: 'https://igeostore.vn/storage/sokkia-b40a-276x276.jpg', badge: 'Hot' },
  { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V500 (1)', image: 'https://igeostore.vn/storage/gnss-rtk-v500-4-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM105', image: 'https://igeostore.vn/storage/im105-276x276.jpg', badge: 'Hot' },
]
