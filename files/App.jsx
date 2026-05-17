import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ShowPage from './pages/ShowPage'
import { Search, PostPage } from './pages/pages'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/show/:name" element={<ShowPage />} />
          <Route path="/search"     element={<Search />} />
          <Route path="/post"       element={<PostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
