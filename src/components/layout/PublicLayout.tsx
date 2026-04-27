import React, { type FC, type ReactNode } from 'react';
import { useInRouterContext } from 'react-router-dom';
import Footer from '../Footer';
import PublicNavbar from './PublicNavbar/PublicNavbar';
import './PublicLayout.css';

interface PublicLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children, mainClassName }) => {
  const inRouter = useInRouterContext();

  return (
    <div className="public-layout" data-testid="public-layout">
      {inRouter ? (
        <PublicNavbar />
      ) : (
        <header data-testid="public-layout-fallback-header" className="public-layout__fallback-header">
          White Caves
        </header>
      )}

      <main id="main-content" className={mainClassName}>{children}</main>

      {inRouter ? (
        <Footer />
      ) : (
        <footer data-testid="public-layout-fallback-footer" className="public-layout__fallback-footer">
          © White Caves Real Estate
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
