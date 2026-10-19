const PHONE_1 = "0929.939.789";
const PHONE_2 = "0707.927.945";

const styles = `
.cs-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  align-items: center;
  gap: 40px;
}

.cs-eyebrow {
  margin: 0 0 28px;
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.cs-title {
  margin: 0 0 20px;
  font-size: clamp(1.75rem, 0.6vw, 2.5rem);
  font-weight: 600;
  line-height: 1.15;
  text-transform: uppercase;
  color: #2b2d31;
}

.cs-phone {
  display: inline-block;
  font-size: clamp(2.75rem, 4.6vw, 1.25rem);
  font-weight: 700;
  line-height: 1.1;
  color: #22abff;
  text-decoration: none;
  letter-spacing: -0.01em;
}
.cs-phone:focus-visible {
  outline: 3px solid #22abff;
  outline-offset: 6px;
  border-radius: 6px;
}

.cs-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px 36px;
  box-shadow: 0 6px 28px rgba(30, 41, 59, 0.1);
}

.cs-card p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.9;
  text-align: justify;
  color: #2b2d31;
}
.cs-card strong { font-weight: 700; }

@media (max-width: 960px) {
  .cs-inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0;
  }
  .cs-section { padding: 48px 20px; }
  .cs-card { padding: 24px; }
  .cs-card p { font-size: 1rem; line-height: 1.8; }
}
`;

export default function ContactSection() {
  return (
    <>
      <style>{styles}</style>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="cs-inner">
          <div className="cs-card">
            <p>
              <strong>
                TRẮC ĐỊA THIÊN PHÚ -
              </strong> Với sứ mệnh mang đến những giải pháp trắc địa hiện đại và chính xác,
              Công ty TNHH Thiết Bị Trắc Địa Thiên Phú luôn sẵn sàng đồng hành cùng khách hàng trong mọi dự án.
              Chúng tôi không chỉ cung cấp sản phẩm chất lượng mà còn mang đến dịch vụ hậu mãi chuyên nghiệp,
              giúp khách hàng đạt được hiệu quả cao nhất trong công việc.
              <br />
              <strong>
                “Chọn Thiên Phú - Chọn sự chính xác và bền vững!”
              </strong>
            </p>
          </div>

          <div className="cs-copy">
            <p className="cs-eyebrow">Bạn cần tư vấn và nhận báo giá</p>
            <h2 className="cs-title">Hãy liên hệ với chúng tôi</h2>
            <a className="cs-phone" href={`tel:${PHONE_1.replace(/\./g, "")}`}>
              {PHONE_1}
            </a>
            <a className="cs-phone" href={`tel:${PHONE_2.replace(/\./g, "")}`}>
              {PHONE_2}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
