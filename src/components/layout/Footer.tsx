function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        <div>
          <p className="text-white font-bold text-lg mb-2"><span className="text-brand">iGeo</span> System</p>
          <p>Công ty TNHH iGeo System - Máy trắc địa chính hãng.</p>
          <p className="mt-2">Hotline: <a href="tel:0972819598" className="text-white font-bold">0972.819.598</a></p>
        </div>
        <div>
          <p className="text-white font-bold mb-2">Chính sách</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Chính sách công ty</a></li>
            <li><a href="#" className="hover:text-white">Chính sách vận chuyển</a></li>
            <li><a href="#" className="hover:text-white">Đăng ký đại lý</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold mb-2">Dịch vụ</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Đo đạc bản đồ</a></li>
            <li><a href="#" className="hover:text-white">Cho thuê thiết bị</a></li>
            <li><a href="#" className="hover:text-white">Sửa chữa, hiệu chuẩn</a></li>
            <li><a href="#" className="hover:text-white">Quét 3D Laser Scan</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold mb-2">Fanpage / Bản đồ</p>
          <div className="bg-gray-800 rounded-xl h-28 flex items-center justify-center text-gray-500">Map placeholder</div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-[12px] py-3">© 2026 iGeo System - Visual clone for learning</div>
    </footer>
  )
}

export default Footer
