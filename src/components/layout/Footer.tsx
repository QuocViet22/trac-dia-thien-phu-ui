import logo from '../../assets/logo.jpg'

const aboutLinks = [
  { label: 'Download phần mềm', href: '#' },
  { label: 'Máy RTK', href: '#' },
  { label: 'Máy toàn đạc điện tử', href: '#' },
  { label: 'Máy thủy bình', href: '#' },
  { label: 'Máy định vị GPS cầm tay', href: '#' },
  { label: 'Đội ngũ chuyên gia', href: '#' },
  { label: 'Về Trắc Địa Thiên Phú', href: '/gioi-thieu' },
]

const infoLinks = [
  'Hướng dẫn mua hàng',
  'Chính sách giao dịch chung',
  'Bảo mật thông tin',
  'Hệ thống chi nhánh',
  'Chính sách vận chuyển',
]

const addresses = [
  'Trụ sở chính: Số 7, Đường Số 2, P.Hiệp Bình, Tp. Hồ Chí Minh',
  'Kho hàng: 647/24 Quốc Lộ 13, P.Hiệp Bình, Tp. Hồ Chí Minh',
  'Vp Hà Nội: Số 23, DM6-DM8, Vạn Phúc, Hà Đông, Tp.Hà Nội',
  'Vp Đà Nẵng: 42 Hoàng Hoa Thám, Q.Thanh Khê, Tp. Đà Nẵng',
]

function Footer() {
  return (
    <footer className="bg-white border-t-[3px] border-brand mt-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] text-sm">
        <div>
          <img src={logo} alt="Trắc Địa Thiên Phú" className="h-12 w-auto object-contain" />
          <p className="font-bold text-gray-900 uppercase mt-3">Công ty TNHH Thiết bị Trắc địa Thiên Phú</p>
          <p className="text-gray-600 mt-2">Mã số thuế: 0318075014</p>
          <p className="text-gray-600 mt-1">
            Hotline:{' '}
            <a href="tel:0983927945" className="font-bold text-gray-900 hover:text-brand">0983.927.945</a>{' '}
            <a href="tel:0979778945" className="font-bold text-gray-900 hover:text-brand">0979.778.945</a>
          </p>
          <p className="text-gray-600 mt-1">Địa chỉ:</p>
          <ul className="mt-1 space-y-2">
            {addresses.map((address) => (
              <li key={address} className="flex gap-2 text-gray-600">
                <i className="fa-solid fa-location-dot mt-1 text-gray-900"></i>
                <span>{address}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold uppercase text-gray-900 text-base mb-3">Về chúng tôi</p>
          <ul className="space-y-2">
            {aboutLinks.map((link) => (
              <li key={link.label}><a href={link.href} className="text-gray-600 hover:text-brand">{link.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold uppercase text-gray-900 text-base mb-3">Thông tin hữu ích</p>
          <ul className="space-y-2">
            {infoLinks.map((link) => (
              <li key={link}><a href="#" className="text-gray-600 hover:text-brand">{link}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold uppercase text-gray-900 text-base mb-3">Phương thức thanh toán</p>
          <p className="text-gray-600">Phương thức thanh toán</p>
          <p className="text-gray-600 mt-4">Kết nối với chúng tôi</p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61552588942367"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Trắc Địa Thiên Phú"
              className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://www.tiktok.com/@thienphurtk?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok Trắc Địa Thiên Phú"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-brand text-white text-center text-sm py-3 px-4">
        © Bản quyền thuộc về CÔNG TY TNHH THIẾT BỊ TRẮC ĐỊA THIÊN PHÚ
      </div>
    </footer>
  )
}

export default Footer
