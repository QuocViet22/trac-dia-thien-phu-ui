import Img from '../../../components/Img.tsx'

function PromoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-[#fdf6e3] to-[#ffeed2] p-4 rounded-xl shadow-sm border border-orange-100 flex relative overflow-hidden h-36">
        <div className="w-2/3 flex flex-col justify-center z-10 relative">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Cơ hội</p>
          <h3 className="font-bold text-sm text-red-600 mb-2 leading-tight">TRỞ THÀNH ĐẠI LÝ<br />GEO STORE</h3>
          <ul className="text-[11px] text-gray-700 space-y-1 mb-2">
            <li><i className="fa-solid fa-check text-green-500 mr-1"></i> Chiết khấu cao</li>
            <li><i className="fa-solid fa-check text-green-500 mr-1"></i> Hỗ trợ tài chính</li>
            <li><i className="fa-solid fa-check text-green-500 mr-1"></i> Hỗ trợ marketing</li>
          </ul>
        </div>
        <div className="absolute right-[-10px] bottom-0 top-0 w-1/2 flex items-end justify-end">
          <Img src="https://igeostore.vn/storage/chinh-sach-dai-ly-1.jpg" fallback="https://placehold.co/300x150?text=Dai+ly" alt="Chính sách đại lý" loading="lazy" className="opacity-90 object-cover w-full h-full" />
        </div>
        <button className="absolute bottom-3 left-4 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-orange-600 z-10"><i className="fa-solid fa-angle-right text-xs"></i></button>
      </div>

      <div className="bg-gradient-to-br from-[#ffeed2] to-[#fdebd0] p-4 rounded-xl shadow-sm border border-orange-100 flex relative overflow-hidden h-36">
        <div className="w-[60%] flex flex-col justify-center z-10 relative">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">IGEO SYSTEM</p>
          <h3 className="font-bold text-sm text-gray-800 mb-2 leading-tight">DỊCH VỤ<br /><span className="text-orange-600">QUÉT 3D LASER SCAN CÔNG TRÌNH</span></h3>
          <ul className="text-[10px] text-gray-600 space-y-0.5 mb-2 leading-tight">
            <li><i className="fa-solid fa-check text-orange-500 mr-1"></i> Độ chính xác cao</li>
            <li><i className="fa-solid fa-check text-orange-500 mr-1"></i> Trực quan với công nghệ tiên tiến nhất</li>
            <li><i className="fa-solid fa-check text-orange-500 mr-1"></i> Giá ưu đãi</li>
          </ul>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[45%]">
          <Img src="https://igeostore.vn/storage/dich-vu-quet-scan-laser-1.jpg" fallback="https://placehold.co/300x150?text=3D+Scan" alt="Quét 3D Laser Scan" loading="lazy" className="w-full h-full object-cover rounded-l-3xl shadow-[-5px_0_15px_rgba(0,0,0,0.1)]" />
        </div>
        <button className="absolute bottom-3 left-4 bg-orange-100 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 text-[10px] font-bold shadow-sm hover:bg-orange-200 z-10 flex items-center gap-1">XEM NGAY <i className="fa-solid fa-angle-right"></i></button>
      </div>

      <div className="bg-gradient-to-br from-[#fff7e6] to-[#ffe8c4] p-4 rounded-xl shadow-sm border border-orange-100 flex relative overflow-hidden h-36">
        <div className="w-1/2 flex flex-col justify-center z-10 relative pr-2">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">IGEO SYSTEM</p>
          <h3 className="font-extrabold text-lg text-gray-800 leading-none mb-1">100% KHÁCH HÀNG</h3>
          <p className="font-bold text-sm text-gray-800 leading-tight mb-2">Đánh giá tích cực<br />Hài lòng về chất lượng</p>
          <button className="bg-orange-100 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 text-[10px] font-bold shadow-sm hover:bg-orange-200 w-max flex items-center gap-1 mt-auto">XEM NGAY <i className="fa-solid fa-angle-right"></i></button>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[45%]">
          <Img src="https://igeostore.vn/storage/khach-hang.jpg" fallback="https://placehold.co/300x150?text=Khach+hang" alt="Khách hàng" loading="lazy" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default PromoCards
