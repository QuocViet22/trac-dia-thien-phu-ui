import Img from '../../../components/Img.tsx'
import logo from '../../../assets/logo.jpg'

function CompanyInfo() {
  return (
    <div>
      <Img src={logo} fallback="https://placehold.co/600x400?text=Thien+Phu" alt="Công ty Thiên Phú" loading="lazy" className="w-full rounded-lg mt-6" />
      <h2 className="text-xl font-bold text-gray-900 text-center mb-4">Thông tin chung</h2>
      <div className="space-y-4 text-gray-800">
        <p><b>Tên Công ty:</b>CÔNG TY TNHH THIẾT BỊ TRẮC ĐỊA THIÊN PHÚ</p>
        <p><b>Mã số thuế: </b>0318075014</p>
        <p><b>Hotline: </b>0983.927.945 | 0979.778.945</p>
        <p><b>Email: </b>nguyenvietthu131982@gmail.com</p>
      </div>
    </div>
  )
}

export default CompanyInfo
