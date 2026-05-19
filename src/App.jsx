import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ShowPage from './pages/ShowPage'
import Feed from './pages/Feed'
import { LoginPage, RegisterPage } from './pages/Auth'
import { Search, PostPage } from './pages/pages'
import Watchlist from './pages/Watchlist'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Footer from './components/Footer'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
          <Navbar />
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/show/:name" element={<ShowPage />} />
            <Route path="/feed"       element={<Feed />} />
            <Route path="/search"     element={<Search />} />
            <Route path="/post"       element={<PostPage />} />
            <Route path="/watchlist"  element={<Watchlist />} />
            <Route path="/about"      element={<About />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="/privacy"    element={<PrivacyPolicy />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}