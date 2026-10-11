const offices = [
  {
    name: 'Trụ sở chính',
    address: 'Số 7, Đường Số 2, P.Hiệp Bình, Tp. Hồ Chí Minh',
  },
  {
    name: 'Kho hàng',
    address: '647/24 Quốc Lộ 13, P.Hiệp Bình, Tp. Hồ Chí Minh',
  },
  {
    name: 'Vp Hà Nội',
    address: 'Số 23, DM6-DM8, Vạn Phúc, Hà Đông, Tp.Hà Nội',
  },
  {
    name: 'Vp Đà Nẵng',
    address: '42 Hoàng Hoa Thám, Q.Thanh Khê, Tp. Đà Nẵng',
  },
]

function LocationsSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start mt-10">
      <div className="h-[400px] lg:h-[560px] overflow-hidden rounded-xl bg-gray-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5745000479083!2d106.725715!3d10.8438385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752922d0253419%3A0x9b1ebe4704865483!2zQ8O0bmcgVHkgVE5ISCBUaGnhur90IELhu4sgVHLhuq9jIMSQ4buLYSBUaGnDqm4gUGjDug!5e0!3m2!1svi!2s!4v1786607244383!5m2!1svi!2s"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="TRẮC ĐỊA THIÊN PHÚ"
          data-f1genz-processed="true"
          className="w-full h-full border-0"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-brand mb-4">Hệ thống cơ sở của Trắc Địa Thiên Phú</h2>
        {offices.map((office) => (
          <div key={office.name} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h3 className="text-gray-900 mb-1">{office.name}</h3>
            <div className="pl-5 text-gray-700 space-y-1">
              <div>{office.address}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LocationsSection
