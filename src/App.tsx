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
import AdminAboutContentPage from './pages/Admin/AdminAboutContentPage'
import AdminBannersPage from './pages/Admin/AdminBannersPage'
import AdminContentPage from './pages/Admin/AdminContentPage'
import AdminFooterContentPage from './pages/Admin/AdminFooterContentPage'
import AdminHomepageContentPage from './pages/Admin/AdminHomepageContentPage'
import AdminImpactStoriesPage from './pages/Admin/AdminImpactStoriesPage'
import AdminMediaLibraryPage from './pages/Admin/AdminMediaLibraryPage'
import AdminAffiliateProductsPage from './pages/Admin/AdminAffiliateProductsPage'
import AdminSearchPage from './pages/Admin/AdminSearchPage'
import AdminMerchProductsPage from './pages/Admin/AdminMerchProductsPage'
import AdminTestimonialsPage from './pages/Admin/AdminTestimonialsPage'
import AdminMessageDetailsPage from './pages/Admin/AdminMessageDetailsPage'
import AdminMessagesPage from './pages/Admin/AdminMessagesPage'
import AdminProductCategoriesPage from './pages/Admin/AdminProductCategoriesPage'
import AdminProductCreatePage from './pages/Admin/AdminProductCreatePage'
import AdminProductEditPage from './pages/Admin/AdminProductEditPage'
import AdminReportsPage from './pages/Admin/AdminReportsPage'
import AdminDonationReportsPage from './pages/Admin/AdminDonationReportsPage'
import AdminCampaignReportsPage from './pages/Admin/AdminCampaignReportsPage'
import AdminDonorReportsPage from './pages/Admin/AdminDonorReportsPage'
import AdminContentReportsPage from './pages/Admin/AdminContentReportsPage'
import AdminProductReportsPage from './pages/Admin/AdminProductReportsPage'
import AdminExportsPage from './pages/Admin/AdminExportsPage'
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
                  <Route path="/admin/content" element={<AdminContentPage />} />
                  <Route path="/admin/content/homepage" element={<AdminHomepageContentPage />} />
                  <Route path="/admin/content/banners" element={<AdminBannersPage />} />
                  <Route path="/admin/content/impact-stories" element={<AdminImpactStoriesPage />} />
                  <Route path="/admin/content/testimonials" element={<AdminTestimonialsPage />} />
                  <Route path="/admin/content/about" element={<AdminAboutContentPage />} />
                  <Route path="/admin/content/footer" element={<AdminFooterContentPage />} />
                  <Route path="/admin/media" element={<AdminMediaLibraryPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
                  <Route path="/admin/messages" element={<AdminMessagesPage />} />
                  <Route path="/admin/messages/:id" element={<AdminMessageDetailsPage />} />
                  <Route path="/admin/products/affiliate" element={<AdminAffiliateProductsPage />} />
                  <Route path="/admin/products/merch" element={<AdminMerchProductsPage />} />
                  <Route path="/admin/products/categories" element={<AdminProductCategoriesPage />} />
                  <Route path="/admin/products/new" element={<AdminProductCreatePage />} />
                  <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
                  <Route path="/admin/reports" element={<AdminReportsPage />} />
                  <Route path="/admin/reports/donations" element={<AdminDonationReportsPage />} />
                  <Route path="/admin/reports/campaigns" element={<AdminCampaignReportsPage />} />
                  <Route path="/admin/reports/donors" element={<AdminDonorReportsPage />} />
                  <Route path="/admin/reports/content" element={<AdminContentReportsPage />} />
                  <Route path="/admin/reports/products" element={<AdminProductReportsPage />} />
                  <Route path="/admin/exports" element={<AdminExportsPage />} />
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
