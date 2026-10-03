export interface Category {
  icon: string
  label: string
}

export interface Slide {
  image: string
  alt: string
}

export interface FeaturedCat {
  image: string
  label: string
}

export interface Product {
  brand: string
  name: string
  price: string
  image: string
  badge?: 'Mới' | 'Hot'
}

export interface CategorySectionData {
  id: string
  title: string
  brands: string[]
  banners: { image: string; alt: string }[]
  products: Product[]
}

export interface NewsItem {
  image: string
  date: string
  title: string
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

export const slides: Slide[] = [
  { image: '', alt: 'Máy GNSS RTK' },
  { image: 'https://igeostore.vn/storage/banner-trang-chu-igeo.jpg', alt: 'Banner iGeo' },
  { image: 'https://igeostore.vn/storage/igeo-store-ban-may-rtk-hi-target.jpg', alt: 'Máy RTK Hi-Target' },
]

export const featuredCats: FeaturedCat[] = [
  { image: 'https://igeostore.vn/storage/gnss-rtk-v200-1-2-276x276.jpg', label: 'Máy GNSS RTK' },
  { image: 'https://igeostore.vn/storage/may-thuy-binh-1-276x276.jpg', label: 'Máy Thủy Bình' },
  { image: 'https://igeostore.vn/storage/sokkia-ix1201-2-276x276.jpg', label: 'Máy toàn đạc điện tử' },
  { image: 'https://igeostore.vn/storage/may-dinh-vi-gps-cam-tay-1-276x276.jpg', label: 'Máy định vị GPS cầm tay' },
  { image: 'https://igeostore.vn/storage/may-can-bang-laser-276x276.jpg', label: 'Máy cân bằng laser' },
  { image: 'https://igeostore.vn/storage/dt-926a1-276x276.jpg', label: 'Thiết bị đo điện' },
]

export const bestSellers: Product[] = [
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-65', price: '130,000,000₫', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-62', price: '146,000,000₫', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Topcon', name: 'Máy cân bằng laser xoay Topcon RL-H5A', price: '38,000,000₫', image: 'https://igeostore.vn/storage/topcon-rl-h5a-34714-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin Montana 710', price: '17,990,000₫', image: 'https://igeostore.vn/storage/may-gps-garmin-montana-710-276x276.jpg', badge: 'Mới' },
  { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V600L', price: '81,000,000₫', image: 'https://igeostore.vn/storage/hi-target-v600l-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị cầm tay Garmin GPSMap H1', price: '18,790,000₫', image: 'https://igeostore.vn/storage/garmin-gpsmap-h1-1-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B20', price: '22,000,000₫', image: 'https://igeostore.vn/storage/may-thuy-binh-sokkia-b20-2-276x276.jpg' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin 65S', price: '10,790,000₫', image: 'https://igeostore.vn/storage/garmin-65s-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B30A', price: '14,000,000₫', image: 'https://igeostore.vn/storage/sokkia-b30a-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B40A (4)', price: '7,300,000₫', image: 'https://igeostore.vn/storage/sokkia-b40a-276x276.jpg', badge: 'Hot' },
]

export const categorySections: CategorySectionData[] = [
  {
    id: 'cat-gnss',
    title: 'Máy GNSS RTK',
    brands: ['Hi-Target', 'Precise', 'Efix', 'Toknav', 'Geomate', 'STEC', 'Satlab'],
    banners: [
      { image: 'https://igeostore.vn/storage/banner-sokkia-ix601.jpg', alt: 'Sokkia IX601' },
      { image: 'https://igeostore.vn/storage/banner-sokkia-im50-series.jpg', alt: 'Sokkia IM50' },
      { image: 'https://igeostore.vn/storage/banner-sokkia-im55.jpg', alt: 'Sokkia IM55' },
    ],
    products: [
      { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V600L', price: '81,000,000₫', image: 'https://igeostore.vn/storage/hi-target-v600l-276x276.jpg', badge: 'Mới' },
      { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V500 (1)', price: '65,000,000₫', image: 'https://igeostore.vn/storage/gnss-rtk-v500-4-276x276.jpg', badge: 'Hot' },
      { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target vRTK (1)', price: '116,000,000₫', image: 'https://igeostore.vn/storage/gnss-vrtk-2-276x276.jpg' },
      { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target iRTK5', price: '135,000,000₫', image: 'https://igeostore.vn/storage/gnss-rtk-irtk5-1-276x276.jpg', badge: 'Hot' },
      { brand: 'Precise', name: 'Máy GNSS RTK Precise X7 Lite', price: '53,000,000₫', image: 'https://igeostore.vn/storage/dt-926a1-276x276.jpg' },
    ],
  },
  {
    id: 'cat-total-gps',
    title: 'Máy toàn đạc & GPS',
    brands: ['Sokkia', 'Leica', 'Garmin'],
    banners: [
      { image: 'https://igeostore.vn/storage/banner-garmin-67.jpg', alt: 'Garmin 67' },
      { image: 'https://igeostore.vn/storage/banner-garmin-65s.jpg', alt: 'Garmin 65S' },
      { image: 'https://igeostore.vn/storage/banner-garmin-etrex-22x.jpg', alt: 'Garmin eTrex' },
    ],
    products: [
      { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM105', price: '168,000,000₫', image: 'https://igeostore.vn/storage/im105-276x276.jpg', badge: 'Hot' },
      { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia FX201', price: '205,000,000₫', image: 'https://igeostore.vn/storage/fx201-276x276.jpg', badge: 'Mới' },
      { brand: 'Sokkia', name: 'Máy toàn đạc Sokkia IM 55', price: '120,000,000₫', image: 'https://igeostore.vn/storage/im55-1-276x276.jpg' },
      { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin GPSMap 67', price: '13,440,000₫', image: 'https://igeostore.vn/storage/garmin-map-67-276x276.jpg', badge: 'Mới' },
      { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin eTrex Solar', price: '6,860,000₫', image: 'https://igeostore.vn/storage/garmin-etrex-solar-1-1-276x276.jpg', badge: 'Mới' },
    ],
  },
  {
    id: 'cat-level',
    title: 'Máy Thủy Bình',
    brands: ['Sokkia', 'Satlab', 'Hi-Target', 'Nikon'],
    banners: [],
    products: [
      { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B20', price: '22,000,000₫', image: 'https://igeostore.vn/storage/may-thuy-binh-sokkia-b20-2-276x276.jpg' },
      { brand: 'Satlab', name: 'Máy Thủy Bình Satlab SAL32 (1)', price: '6,480,000₫', image: 'https://igeostore.vn/storage/satlab-sal32-276x276.jpg' },
      { brand: 'Hi-Target', name: 'Máy Thủy Bình Hi-Target HT32', price: '6,800,000₫', image: 'https://igeostore.vn/storage/hi-target-ht32-276x276.jpg' },
      { brand: 'JBL', name: 'Máy bộ đàm JBL 380', price: '864,000₫', image: 'https://igeostore.vn/storage/may-bo-dam-jbl-380-1-276x276.jpg' },
      { brand: 'Laisai', name: 'Máy cân bằng laser 12 tia xanh Laisai LSG6650', price: '3,800,000₫', image: 'https://igeostore.vn/storage/laisai-lsg6650-1-276x276.jpg' },
    ],
  },
]

export const serviceBanners: { image: string; alt: string }[] = [
  { image: 'https://igeostore.vn/storage/dich-vu-do-dac-ban-do-ad.jpg', alt: 'Dịch vụ đo đạc bản đồ' },
  { image: 'https://igeostore.vn/storage/dich-vu-cho-thue-thiet-bi-do-dac.jpg', alt: 'Cho thuê thiết bị' },
  { image: 'https://igeostore.vn/storage/dich-vu-sua-chua-thiet-bi-do-dac.jpg', alt: 'Sửa chữa thiết bị' },
]

export const news: NewsItem[] = [
  { image: 'https://igeostore.vn/storage/banner-trang-chu-igeo.jpg', date: '03/10/2026', title: 'Thông tin chuyên ngành trắc địa mới nhất' },
  { image: 'https://igeostore.vn/storage/igeo-store-ban-may-rtk-hi-target.jpg', date: '03/10/2026', title: 'Hướng dẫn sử dụng máy GNSS RTK Hi-Target' },
  { image: 'https://igeostore.vn/storage/dich-vu-quet-scan-laser-1.jpg', date: '03/10/2026', title: 'Phần mềm hữu ích cho đo đạc bản đồ' },
]
