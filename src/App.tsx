import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ConfirmationPage from './pages/ConfirmationPage';
import FamilyFaithFormationPage from './pages/FamilyFaithFormationPage';
import FaithFormationLandingPage from './pages/FaithFormationLandingPage';
import SacramentsPage from './pages/SacramentsPage';
import MusicMinistryPage from './pages/MusicMinistryPage';
import LivingOurFaithPage from './pages/LivingOurFaithPage';
import GivePage from './pages/GivePage';
import NewVisitorsPage from './pages/NewVisitorsPage';
import OCIAPage from './pages/OCIAPage';
import MassPage from './pages/MassPage';
import FormedPage from './pages/FormedPage';
import LectorsAltarEucharisticPage from './pages/LectorsAltarEucharisticPage';
import GreetersUshersPage from './pages/GreetersUshersPage';
import AltarGuildHospitalityPage from './pages/AltarGuildHospitalityPage';
import HomeboundGriefPage from './pages/HomeboundGriefPage';
import MinistriesLandingPage from './pages/MinistriesLandingPage';
import GroupsLandingPage from './pages/GroupsLandingPage';
import FamilyCirclePage from './pages/FamilyCirclePage';
import GenXishPage from './pages/GenXishPage';
import RegistrationPage from './pages/RegistrationPage';
import CalendarPage from './pages/CalendarPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminCalendarPage from './pages/AdminCalendarPage';
import BulletinsPage from './pages/BulletinsPage';
import DynamicPage from './pages/DynamicPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PreviewPage from './pages/PreviewPage';
import { MpLoginPage, MyGivingPage, MyPledgesPage } from './pages/GivingAccountPages';
function ScrollToTop() {
  const { pathname, key } = useLocation();
  const scrollPositions = useRef<Record<string, number>>({});
  const prevKey = useRef<string>(key);

  useEffect(() => {
    const isPopState = window.history.state?.idx !== undefined &&
      window.history.state?.idx < (scrollPositions.current['__idx__'] ?? 0);

    if (isPopState) {
      const saved = scrollPositions.current[key];
      if (saved !== undefined) {
        requestAnimationFrame(() => window.scrollTo(0, saved));
      }
    } else {
      window.scrollTo(0, 0);
    }

    scrollPositions.current['__idx__'] = window.history.state?.idx ?? 0;
    prevKey.current = key;

    const handleScroll = () => {
      scrollPositions.current[key] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, key]);

  return null;
}

function SiteLayout() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Standalone pages — no nav/footer */}
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/calendar" element={
          <RequireAuth>
            <AdminCalendarPage />
          </RequireAuth>
        } />
        <Route path="/admin" element={<Navigate to="/admin/calendar" replace />} />

        {/* All other pages share the site layout */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mission-values" element={<Navigate to="/about#mission" replace />} />
          <Route path="/why-corpus" element={<Navigate to="/about#why-corpus" replace />} />
          <Route path="/staff" element={<Navigate to="/about#staff" replace />} />
          <Route path="/mass" element={<MassPage />} />
          <Route path="/bulletins" element={<BulletinsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faith-formation" element={<FaithFormationLandingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/family-faith-formation" element={<FamilyFaithFormationPage />} />
          <Route path="/sacraments" element={<SacramentsPage />} />
          <Route path="/ocia" element={<OCIAPage />} />
          <Route path="/music-ministry" element={<MusicMinistryPage />} />
          <Route path="/living-our-faith" element={<LivingOurFaithPage />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/new-visitors" element={<NewVisitorsPage />} />
          <Route path="/formed" element={<FormedPage />} />
          <Route path="/lectors-altar-eucharistic" element={<LectorsAltarEucharisticPage />} />
          <Route path="/greeters-ushers" element={<GreetersUshersPage />} />
          <Route path="/altarguild-hospitality" element={<AltarGuildHospitalityPage />} />
          <Route path="/homebound-grief" element={<HomeboundGriefPage />} />
          <Route path="/ministries" element={<MinistriesLandingPage />} />
          <Route path="/groups" element={<GroupsLandingPage />} />
          <Route path="/family-circle" element={<FamilyCirclePage />} />
          <Route path="/genxish" element={<GenXishPage />} />
          <Route path="/pages/:slug" element={<DynamicPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/login" element={<MpLoginPage />} />
          <Route path="/My-Giving" element={<MyGivingPage />} />
          <Route path="/My-Pledges" element={<MyPledgesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
