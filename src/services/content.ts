import localforage from 'localforage'

const CONTENT_KEY = 'content'

export type TextBlock = {
  type: 'text'
  content: string
}

export type VideoBlock = {
  type: 'video'
  url: string
}

export type ImageBlock = {
  type: 'image'
  url: string
  caption?: string
}

export type ContentBlock = TextBlock | VideoBlock | ImageBlock

export type ContentPage = {
  id: string
  title: string
  blocks: ContentBlock[]
}

export type ContentSection = {
  id: string
  title: string
  pages: ContentPage[]
}

export type AppContent = {
  sections: ContentSection[]
}

const emptyContent: AppContent = {
  sections: [],
}

function normalizeContent(input: unknown): AppContent {
  if (!input || typeof input !== 'object') {
    return emptyContent
  }

  const maybeSections = (input as { sections?: unknown }).sections
  if (!Array.isArray(maybeSections)) {
    return emptyContent
  }

  return {
    sections: maybeSections.map((section) => {
      const safeSection = (section ?? {}) as {
        id?: unknown
        title?: unknown
        pages?: unknown
      }

      const pages = Array.isArray(safeSection.pages) ? safeSection.pages : []

      return {
        id: typeof safeSection.id === 'string' ? safeSection.id : '',
        title: typeof safeSection.title === 'string' ? safeSection.title : 'Sem titulo',
        pages: pages.map((page) => {
          const safePage = (page ?? {}) as {
            id?: unknown
            title?: unknown
            blocks?: unknown
          }

          const blocks = Array.isArray(safePage.blocks) ? safePage.blocks : []

          return {
            id: typeof safePage.id === 'string' ? safePage.id : '',
            title: typeof safePage.title === 'string' ? safePage.title : 'Sem titulo',
            blocks: blocks
              .map((block) => {
                const safeBlock = (block ?? {}) as {
                  type?: unknown
                  content?: unknown
                  url?: unknown
                  caption?: unknown
                }

                if (safeBlock.type === 'text') {
                  return {
                    type: 'text' as const,
                    content:
                      typeof safeBlock.content === 'string' ? safeBlock.content : '',
                  }
                }

                if (safeBlock.type === 'video') {
                  return {
                    type: 'video' as const,
                    url: typeof safeBlock.url === 'string' ? safeBlock.url : '',
                  }
                }

                if (safeBlock.type === 'image') {
                  return {
                    type: 'image' as const,
                    url: typeof safeBlock.url === 'string' ? safeBlock.url : '',
                    caption:
                      typeof safeBlock.caption === 'string'
                        ? safeBlock.caption
                        : undefined,
                  }
                }

                return null
              })
              .filter((block): block is ContentBlock => block !== null),
          }
        }),
      }
    }),
  }
}

export async function loadContent(): Promise<AppContent> {
  const cached = (await localforage.getItem<AppContent>(CONTENT_KEY)) ?? emptyContent

  try {
    const res = await fetch('/content.json')
    if (!res.ok) {
      throw new Error('Failed to fetch content.json')
    }

    const fresh = normalizeContent(await res.json())
    await localforage.setItem(CONTENT_KEY, fresh)
    return fresh
  } catch {
    return normalizeContent(cached)
  }
}
