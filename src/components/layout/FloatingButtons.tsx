import zalo_icon from '../../assets/floating_icon/Icon_of_Zalo.svg.webp'

function FloatingButtons() {
  return (
    <div className="floating-btns fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <a href="tel:0979.778.945" aria-label="Gọi hotline" className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-lg hover:bg-sky-600"><i className="fa-solid fa-phone"></i></a>
      <a href="https://chat.zalo.me/?phone=0979.778.945" target="_" rel="noopener noreferrer" aria-label="Chat Zalo" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"><img src={zalo_icon} alt="Zalo" className="w-6 h-6" /></a>
    </div>
  )
}

export default FloatingButtons
