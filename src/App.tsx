import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage'
import { SectionPage } from './pages/SectionPage'
import type { AppContent } from './services/content'
import { loadContent } from './services/content'

function App() {
  const [content, setContent] = useState<AppContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    loadContent()
      .then((loadedContent) => {
        if (active) {
          setContent(loadedContent)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Cuidar App</h1>
        <p>Conteudo editavel por Decap CMS com cache local.</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage content={content} loading={loading} />} />
          <Route
            path="/section/:sectionId/page/:pageId"
            element={<SectionPage content={content} loading={loading} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
