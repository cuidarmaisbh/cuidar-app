import type { ContentBlock } from '../services/content'

type BlockRendererProps = {
  block: ContentBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <p>{block.content}</p>

    case 'video':
      return (
        <iframe
          src={block.url}
          width="100%"
          height="200"
          title="Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )

    case 'image':
      return (
        <figure>
          <img src={block.url} alt={block.caption || 'Imagem de conteudo'} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )

    default:
      return null
  }
}
