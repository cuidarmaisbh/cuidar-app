import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '../components/BlockRenderer'
import type { AppContent } from '../services/content'

type SectionPageProps = {
  content: AppContent | null
  loading: boolean
}

export function SectionPage({ content, loading }: SectionPageProps) {
  const { sectionId, pageId } = useParams()

  if (loading) {
    return <p>Carregando conteudo...</p>
  }

  if (!content) {
    return <p>Conteudo indisponivel.</p>
  }

  const section = content.sections.find((item) => item.id === sectionId)
  const page = section?.pages.find((item) => item.id === pageId)

  if (!section || !page) {
    return (
      <section>
        <p>Pagina nao encontrada.</p>
        <Link to="/">Voltar</Link>
      </section>
    )
  }

  return (
    <article className="page-content">
      <p>
        <Link to="/">Voltar</Link>
      </p>
      <h2>{section.title}</h2>
      <h3>{page.title}</h3>
      {page.blocks.map((block, index) => (
        <BlockRenderer key={`${block.type}-${index}`} block={block} />
      ))}
    </article>
  )
}
