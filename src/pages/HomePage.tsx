import { Link } from 'react-router-dom'
import type { AppContent } from '../services/content'

type HomePageProps = {
  content: AppContent | null
  loading: boolean
}

export function HomePage({ content, loading }: HomePageProps) {
  if (loading) {
    return <p>Carregando conteudo...</p>
  }

  if (!content || content.sections.length === 0) {
    return <p>Nenhum conteudo disponivel.</p>
  }

  return (
    <section>
      {content.sections.map((section) => (
        <article key={section.id || section.title} className="section-card">
          <h2>{section.title}</h2>
          <ul>
            {section.pages.map((page) => (
              <li key={page.id || page.title}>
                <Link to={`/section/${section.id}/page/${page.id}`}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}
