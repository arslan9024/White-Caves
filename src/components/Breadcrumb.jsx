import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const routeLabels = {
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

export default function Breadcrumb({ customItems, showHome = true }) {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {showHome && (
            <li className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Home</span>
              </Link>
              <span className="breadcrumb-separator">/</span>
            </li>
          )}
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="breadcrumb-item">
              {item.isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
