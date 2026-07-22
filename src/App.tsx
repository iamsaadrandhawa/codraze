import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { visitorTracker } from './lib/visitorTracker';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import SplashScreen, { shouldShowSplash } from './components/SplashScreen';
import AdminGuard from './components/admin/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogs from './pages/admin/blogs/AdminBlogs';
import AdminBlogForm from './pages/admin/blogs/AdminBlogForm';
import AdminProjects from './pages/admin/projects/AdminProjects';
import AdminProjectForm from './pages/admin/projects/AdminProjectForm';
import AdminContacts from './pages/admin/AdminContacts';
import AdminServices from './pages/admin/services/AdminServices';
import AdminServiceForm from './pages/admin/services/AdminServiceForm'
import AdminCourses from './pages/admin/courses/AdminCourses';
import AdminCourseForm from './pages/admin/courses/AdminCourseForm';
import AdminTestimonials from './pages/admin/testimonials/AdminTestimonials';
import AdminTestimonialForm from './pages/admin/testimonials/AdminTestimonialForm';
import AdminFaqs from './pages/admin/faq/AdminFaq';
import AdminFaqForm from './pages/admin/faq/AdminFaqForm';
import AdminRoles from './pages/admin/roles/AdminRoles';
import AdminRoleForm from './pages/admin/roles/AdminRoleForm';
import AdminUsers from './pages/admin/users/AdminUsers';
import AdminPricing from './pages/admin/pricing/AdminPricing';
import AdminSubscribers from './pages/admin/subscribers/AdminSubscriber';
// Import Locations page (not VisitorTracker)
import Locations from './pages/admin/location/Locations';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => shouldShowSplash());

  // Track visitor on app load - only once
  useEffect(() => {
    console.log('📍 App initialized - tracking visitor');
    const timer = setTimeout(() => {
      visitorTracker.track();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          {/* Public site - VisitorTracker is inside MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected */}
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route element={<AdminGuard tabKey="dashboard" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              <Route element={<AdminGuard tabKey="blogs" />}>
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/blogs/new" element={<AdminBlogForm />} />
                <Route path="/admin/blogs/:id" element={<AdminBlogForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="projects" />}>
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/projects/new" element={<AdminProjectForm />} />
                <Route path="/admin/projects/:id" element={<AdminProjectForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="services" />}>
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/services/new" element={<AdminServiceForm />} />
                <Route path="/admin/services/:id" element={<AdminServiceForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="courses" />}>
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/new" element={<AdminCourseForm />} />
                <Route path="/admin/courses/:id" element={<AdminCourseForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="testimonials" />}>
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/testimonials/new" element={<AdminTestimonialForm />} />
                <Route path="/admin/testimonials/:id" element={<AdminTestimonialForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="subscribers" />}>
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
              </Route>

              <Route element={<AdminGuard tabKey="pricing" />}>
                <Route path="/admin/pricing" element={<AdminPricing />} />
              </Route>

              <Route element={<AdminGuard tabKey="faq" />}>
                <Route path="/admin/faq" element={<AdminFaqs />} />
                <Route path="/admin/faq/new" element={<AdminFaqForm />} />
                <Route path="/admin/faq/:id" element={<AdminFaqForm />} />
              </Route>

              <Route element={<AdminGuard tabKey="contacts" />}>
                <Route path="/admin/contacts" element={<AdminContacts />} />
              </Route>

              {/* Location page - displays visitor data */}
              <Route element={<AdminGuard tabKey="location" />}>
                <Route path="/admin/location" element={<Locations />} />
              </Route>

              <Route element={<AdminGuard superAdminOnly />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/roles/new" element={<AdminRoleForm />} />
                <Route path="/admin/roles/:id" element={<AdminRoleForm />} />
              </Route>
            </Route>
          </Route>

          {/* /admin redirect */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}