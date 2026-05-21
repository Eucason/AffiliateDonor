import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/organisms/Navbar'
import Footer from './components/organisms/Footer'
import HomePage from './pages/Home/HomePage'
import CausesPage from './pages/Causes/CausesPage'
import CausePage from './pages/Cause/CausePage'
import ShopPage from './pages/Shop/ShopPage'
import MerchPage from './pages/Merch/MerchPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AdminBlogsPage from './pages/Admin/AdminBlogsPage'
import AdminBlogCreatePage from './pages/Admin/AdminBlogCreatePage'
import AdminBlogEditPage from './pages/Admin/AdminBlogEditPage'
import AboutPage from './pages/About/AboutPage'
import MissionPage from './pages/Mission/MissionPage'
import PartnersPage from './pages/Partners/PartnersPage'
import BlogPage from './pages/Blog/BlogPage'
import BlogDetailsPage from './pages/Blog/BlogDetailsPage'
import HowItWorksPage from './pages/HowItWorks/HowItWorksPage'
import HelpPage from './pages/Help/HelpPage'
import ContactPage from './pages/Contact/ContactPage'
import FaqsPage from './pages/Faqs/FaqsPage'
import TermsPage from './pages/Terms/TermsPage'
import ScrollToTop from './components/utils/ScrollToTop'
import ProtectedRoute from './components/utils/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ScrollToTop />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/causes" element={<CausesPage />} />
                <Route path="/cause/:id" element={<CausePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/merch" element={<MerchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/mission" element={<MissionPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Admin Routes - Protected */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/blogs" element={<AdminBlogsPage />} />
                  <Route path="/admin/blogs/new" element={<AdminBlogCreatePage />} />
                  <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
