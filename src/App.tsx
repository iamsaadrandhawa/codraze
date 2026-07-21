import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
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

export default function App() {
  const [showSplash, setShowSplash] = useState(() => shouldShowSplash());

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          {/* Public site */}
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/blogs/new" element={<AdminBlogForm />} />
              <Route path="/admin/blogs/:id" element={<AdminBlogForm />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/projects/new" element={<AdminProjectForm />} />
              <Route path="/admin/projects/:id" element={<AdminProjectForm />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
            </Route>
          </Route>

          {/* /admin redirect */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
