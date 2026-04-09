import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import netlifyIdentity from 'netlify-identity-widget'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })

netlifyIdentity.init({
  APIUrl: 'https://cuidarmaisbh.netlify.app/.netlify/identity',
})

netlifyIdentity.on('login', () => {
  netlifyIdentity.close()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
