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
import AdminCauseCreatePage from './pages/Admin/AdminCauseCreatePage'
import AdminCauseDetailsPage from './pages/Admin/AdminCauseDetailsPage'
import AdminCauseEditPage from './pages/Admin/AdminCauseEditPage'
import AdminCausesPage from './pages/Admin/AdminCausesPage'
import AdminDonationDetailsPage from './pages/Admin/AdminDonationDetailsPage'
import AdminDonationsPage from './pages/Admin/AdminDonationsPage'
import AdminBlogsPage from './pages/Admin/AdminBlogsPage'
import AdminBlogCreatePage from './pages/Admin/AdminBlogCreatePage'
import AdminBlogEditPage from './pages/Admin/AdminBlogEditPage'
import AdminSearchPage from './pages/Admin/AdminSearchPage'
import AdminUserDetailsPage from './pages/Admin/AdminUserDetailsPage'
import AdminUsersPage from './pages/Admin/AdminUsersPage'
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
import AdminPlaceholderPage from './components/admin/shared/AdminPlaceholderPage'
import { resolveAdminRouteMeta } from './config/adminRoutes'

function adminPlaceholder(path: string) {
  const routeMeta = resolveAdminRouteMeta(path)

  return <AdminPlaceholderPage title={routeMeta.title} description={routeMeta.description} />
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {!isAdminRoute && <Navbar />}
          <ScrollToTop />
          <main className={isAdminRoute ? 'flex-1 min-h-screen' : 'flex-1'}>
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
                  <Route path="/admin/donations" element={<AdminDonationsPage />} />
                  <Route path="/admin/donations/:id" element={<AdminDonationDetailsPage />} />
                  <Route path="/admin/causes" element={<AdminCausesPage />} />
                  <Route path="/admin/causes/new" element={<AdminCauseCreatePage />} />
                  <Route path="/admin/causes/:id" element={<AdminCauseDetailsPage />} />
                  <Route path="/admin/causes/:id/edit" element={<AdminCauseEditPage />} />
                  <Route path="/admin/blogs" element={<AdminBlogsPage />} />
                  <Route path="/admin/blogs/new" element={<AdminBlogCreatePage />} />
                  <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditPage />} />
                  <Route path="/admin/content" element={adminPlaceholder('/admin/content')} />
                  <Route path="/admin/content/homepage" element={adminPlaceholder('/admin/content/homepage')} />
                  <Route path="/admin/content/banners" element={adminPlaceholder('/admin/content/banners')} />
                  <Route path="/admin/content/impact-stories" element={adminPlaceholder('/admin/content/impact-stories')} />
                  <Route path="/admin/content/testimonials" element={adminPlaceholder('/admin/content/testimonials')} />
                  <Route path="/admin/content/about" element={adminPlaceholder('/admin/content/about')} />
                  <Route path="/admin/content/footer" element={adminPlaceholder('/admin/content/footer')} />
                  <Route path="/admin/media" element={adminPlaceholder('/admin/media')} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
                  <Route path="/admin/messages" element={adminPlaceholder('/admin/messages')} />
                  <Route path="/admin/messages/:id" element={adminPlaceholder('/admin/messages/:id')} />
                  <Route path="/admin/products/affiliate" element={adminPlaceholder('/admin/products/affiliate')} />
                  <Route path="/admin/products/merch" element={adminPlaceholder('/admin/products/merch')} />
                  <Route path="/admin/products/categories" element={adminPlaceholder('/admin/products/categories')} />
                  <Route path="/admin/products/new" element={adminPlaceholder('/admin/products/new')} />
                  <Route path="/admin/products/:id/edit" element={adminPlaceholder('/admin/products/:id/edit')} />
                  <Route path="/admin/reports" element={adminPlaceholder('/admin/reports')} />
                  <Route path="/admin/reports/donations" element={adminPlaceholder('/admin/reports/donations')} />
                  <Route path="/admin/reports/campaigns" element={adminPlaceholder('/admin/reports/campaigns')} />
                  <Route path="/admin/reports/donors" element={adminPlaceholder('/admin/reports/donors')} />
                  <Route path="/admin/reports/content" element={adminPlaceholder('/admin/reports/content')} />
                  <Route path="/admin/reports/products" element={adminPlaceholder('/admin/reports/products')} />
                  <Route path="/admin/exports" element={adminPlaceholder('/admin/exports')} />
                  <Route path="/admin/notifications" element={adminPlaceholder('/admin/notifications')} />
                  <Route path="/admin/settings" element={adminPlaceholder('/admin/settings')} />
                  <Route path="/admin/audit-logs" element={adminPlaceholder('/admin/audit-logs')} />
                  <Route path="/admin/approvals" element={adminPlaceholder('/admin/approvals')} />
                  <Route path="/admin/search" element={<AdminSearchPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </main>
          {!isAdminRoute && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
