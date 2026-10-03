function FloatingButtons() {
  return (
    <div className="floating-btns fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <a href="tel:0972819598" aria-label="Gọi hotline" className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-lg hover:bg-sky-600"><i className="fa-solid fa-phone"></i></a>
      <a href="#" aria-label="Chat Zalo" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"><i className="fa-solid fa-comment"></i></a>
    </div>
  )
}

export default FloatingButtons
