import type { Product } from '../../dashboard/data.ts'

const applications: string[] = [
  'Khảo sát địa hình: đo vẽ hiện trạng, thu thập dữ liệu bản đồ số.',
  'Hạ tầng giao thông: triển khai tim tuyến, kiểm tra cao độ.',
  'Xây dựng dân dụng: định vị trục công trình, kiểm tra hoàn công.',
  'Công nghiệp: bố trí kết cấu, thiết bị yêu cầu độ chính xác cao.',
]

function ProductArticle({ product }: { product: Product }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
      <h3 className="font-bold text-gray-900 mb-2">Tổng quan</h3>
      <p className="text-gray-600 text-sm mb-4">
        {product.name} là thiết bị chính hãng do TRẮC ĐỊA THIÊN PHÚ phân phối, phù hợp cho các đơn vị khảo sát,
        xây dựng và thi công hạ tầng cần độ chính xác và độ bền cao.
      </p>
      <h3 className="font-bold text-gray-900 mb-2">Ưu điểm nổi bật</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
        <li>Thương hiệu {product.brand} uy tín, hàng chính hãng.</li>
        <li>Hoạt động ổn định trong điều kiện công trường khắc nghiệt.</li>
        <li>Kết nối và quản lý dữ liệu thuận tiện giữa hiện trường và văn phòng.</li>
        <li>Tiết kiệm thời gian thi công, độ chính xác đáp ứng yêu cầu khắt khe.</li>
      </ul>
      <h3 className="font-bold text-gray-900 mb-2">Thông số kỹ thuật</h3>
      <table className="w-full text-sm mb-4">
        <tbody>
          {[
            ['Thương hiệu', product.brand],
            ['Tình trạng', 'Còn hàng'],
            ['Bảo hành', '12 tháng chính hãng'],
            ['Giao hàng', 'Toàn quốc, hướng dẫn sử dụng tận nơi'],
          ].map(([label, value]) => (
            <tr key={label} className="border-t border-gray-100">
              <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">{label}</td>
              <td className="py-2 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="font-bold text-gray-900 mb-2">Ứng dụng thực tiễn</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
        {applications.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 className="font-bold text-gray-900 mb-2">Liên hệ tư vấn và báo giá</h3>
      <p className="text-sm text-gray-600">
        Hỗ trợ tư vấn kỹ thuật <a href="tel:0983927945" className="font-bold text-gray-900 hover:text-brand">0983.927.945</a>
        {' '}— Báo giá dự án <a href="tel:0979778945" className="font-bold text-gray-900 hover:text-brand">0979.778.945</a>.
      </p>
    </section>
  )
}

export default ProductArticle
