import { Link } from 'react-router'

export interface ContentSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  closing?: string
}

interface ContentArticleProps {
  title: string
  intro?: string[]
  outro?: string[]
  sections: ContentSection[]
}

function ContentArticle({ title, intro, outro, sections }: ContentArticleProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <article className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 text-[15px] sm:text-base leading-relaxed text-gray-800">
        {intro && intro.length > 0 && (
          <div className="space-y-4">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
            {(section.paragraphs || section.bullets) && (
              <div className="space-y-3">
                {section.paragraphs && (
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {section.closing && <p className="mt-4">{section.closing}</p>}
          </section>
        ))}
        {outro && outro.length > 0 && (
          <div className="mt-8 space-y-4">
            {outro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

export default ContentArticle
