import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import { useTheme } from '../hooks/useTheme';

export default function MainLayout() {
  useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 animate-page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
