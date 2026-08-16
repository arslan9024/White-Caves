import React, { type FC, type ReactNode } from 'react';
import { useInRouterContext, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import PublicNavbar from './PublicNavbar/PublicNavbar';
import OfflineBanner from '../OfflineBanner';
import BackToTopButton from '../navigation/BackToTopButton/BackToTopButton';
import './PublicLayout.css';

interface PublicLayoutProps {
  children: ReactNode;
  mainClassName?: string;
  hideFooter?: boolean;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children, mainClassName, hideFooter }) => {
  const inRouter = useInRouterContext();
  let pathname = '';
  try {
    const location = useLocation();
    pathname = location.pathname;
  } catch (e) {
    // router fallback
  }

  // Hide footer if explicitly requested or if on app/dashboard/profile views
  const shouldHideFooter = hideFooter || pathname.includes('/dashboard') || pathname.includes('/profile') || pathname.includes('/crm');

  return (
    <div className="public-layout" data-testid="public-layout">
      {/* Phase 25 Error UX: offline detection banner (fixed, top of viewport) */}
      <OfflineBanner />

      {inRouter ? (
        <PublicNavbar />
      ) : (
        <header
          data-testid="public-layout-fallback-header"
          className="public-layout__fallback-header"
        >
          White Caves
        </header>
      )}

      <main id="main-content" className={mainClassName}>
        {children}
      </main>

      {!shouldHideFooter && (
        inRouter ? (
          <Footer />
        ) : (
          <footer
            data-testid="public-layout-fallback-footer"
            className="public-layout__fallback-footer"
          >
            © White Caves Real Estate
          </footer>
        )
      )}

      {/* Global Back To Top Floating Action */}
      <BackToTopButton />
    </div>
  );
};

export default PublicLayout;
