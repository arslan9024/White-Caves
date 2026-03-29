import React, { FC, ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BreadcrumbNav,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrent
} from './Breadcrumb.styles';

/**
 * Safely render a JSON-LD <script> tag without dangerouslySetInnerHTML.
 * Uses a ref to set textContent directly, which is XSS-safe because
 * textContent is never parsed as HTML.
 */
const JsonLdScript: FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const ref = React.useRef<HTMLScriptElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.textContent = JSON.stringify(data);
    }
  }, [data]);

  return <script ref={ref} type="application/ld+json" />;
};

interface BreadcrumbItemType {
  path: string;
  label: string;
  isLast: boolean;
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItemType[];
  showHome?: boolean;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'properties': 'Properties',
  'services': 'Services',
  'careers': 'Careers',
  'contact': 'Contact',
  'about': 'About',
  'buyer': 'Buyer',
  'seller': 'Seller',
  'tenant': 'Tenant',
  'landlord': 'Landlord',
  'owner': 'Owner',
  'leasing-agent': 'Leasing Agent',
  'secondary-sales-agent': 'Sales Agent',
  'dashboard': 'Dashboard',
  'mortgage-calculator': 'Mortgage Calculator',
  'dld-fees': 'DLD Fee Calculator',
  'title-deed-registration': 'Title Deed Registration',
  'pricing-tools': 'Pricing Tools',
  'contracts': 'Contracts',
  'system-health': 'System Health',
  'profile': 'Profile',
  'signin': 'Sign In',
  'select-role': 'Select Role'
};

const Breadcrumb: FC<BreadcrumbProps> = ({ customItems, showHome = true }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  if (location.pathname === '/' || pathnames.length === 0) {
    return null;
  }

  const breadcrumbItems = customItems || pathnames.map((segment, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = routeLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const isLast = index === pathnames.length - 1;
    
    return { path, label, isLast };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      showHome && {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://whitecaves.com/"
      },
      ...breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": showHome ? index + 2 : index + 1,
        "name": item.label,
        "item": `https://whitecaves.com${item.path}`
      }))
    ].filter(Boolean)
  };

  return (
    <>
      <JsonLdScript data={structuredData} />
      <BreadcrumbNav aria-label="Breadcrumb">
        <BreadcrumbList>
          {showHome && (
            <BreadcrumbItem>
              <BreadcrumbLink to="/">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Home</span>
              </BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
          )}
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {item.isLast ? (
                <BreadcrumbCurrent aria-current="page">
                  {item.label}
                </BreadcrumbCurrent>
              ) : (
                <>
                  <BreadcrumbLink to={item.path}>
                    {item.label}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </BreadcrumbNav>
    </>
  );
};

export default Breadcrumb;
