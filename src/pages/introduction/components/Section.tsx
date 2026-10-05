import type { ReactNode } from 'react'

interface SectionProps {
  index: string
  heading: string
  children: ReactNode
}

function Section({ index, heading, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
        {index}. {heading}
      </h2>
      <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700">{children}</div>
    </section>
  )
}

export default Section
