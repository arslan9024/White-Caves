import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const defaultMeta = {
  title: 'White Caves Real Estate Dubai | Luxury Villas, Apartments & Penthouses',
  description: "White Caves is Dubai's premier luxury real estate platform. Find exclusive villas, apartments, and penthouses in Palm Jumeirah, Downtown Dubai, Emirates Hills, and Dubai Marina.",
  image: '/company-logo.jpg',
  url: 'https://whitecaves.com',
  type: 'website'
};

const pageMeta = {
  '/': {
    title: 'White Caves Real Estate Dubai | Luxury Villas, Apartments & Penthouses',
    description: "Dubai's premier luxury real estate platform. Find exclusive villas, apartments, and penthouses in Palm Jumeirah, Downtown Dubai, and more."
  },
  '/properties': {
    title: 'Dubai Properties for Sale & Rent | White Caves Real Estate',
    description: 'Browse our exclusive collection of luxury villas, apartments, and penthouses in Dubai. Filter by location, price, and property type.'
  },
  '/services': {
    title: 'Real Estate Services Dubai | White Caves',
    description: 'Comprehensive real estate services including property management, investment advisory, mortgage assistance, and legal support.'
  },
  '/careers': {
    title: 'Real Estate Careers Dubai | Join White Caves Team',
    description: 'Join Dubai\'s leading luxury real estate team. Explore career opportunities for agents, brokers, and support staff.'
  },
  '/contact': {
    title: 'Contact White Caves Real Estate Dubai',
    description: 'Get in touch with our expert real estate team. Visit our office in Business Bay or call us for property inquiries.'
  },
  '/buyer/mortgage-calculator': {
    title: 'Dubai Mortgage Calculator | White Caves Real Estate',
    description: 'Calculate your monthly mortgage payments for Dubai properties. Compare rates and find the best mortgage options.'
  },
  '/buyer/dld-fees': {
    title: 'Dubai DLD Fee Calculator | Property Transfer Costs',
    description: 'Calculate Dubai Land Department fees and property transfer costs. Understand all charges involved in buying property in Dubai.'
  },
  '/seller/dashboard': {
    title: 'Seller Dashboard | White Caves Real Estate',
    description: 'Manage your property listings, view inquiries, and track your sales performance with White Caves.'
  },
  '/buyer/dashboard': {
    title: 'Buyer Dashboard | White Caves Real Estate',
    description: 'Access your saved properties, scheduled viewings, and property search preferences.'
  },
  '/tenant/dashboard': {
    title: 'Tenant Portal | White Caves Real Estate',
    description: 'Manage your rental, submit maintenance requests, and view payment history.'
  },
  '/landlord/dashboard': {
    title: 'Landlord Portal | White Caves Real Estate',
    description: 'Manage your rental properties, track income, and handle tenant communications.'
  }
};

export default function SEO({ title, description, image, type, noIndex = false }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const pageSpecificMeta = pageMeta[currentPath] || {};
  
  const meta = {
    title: title || pageSpecificMeta.title || defaultMeta.title,
    description: description || pageSpecificMeta.description || defaultMeta.description,
    image: image || defaultMeta.image,
    url: `${defaultMeta.url}${currentPath}`,
    type: type || defaultMeta.type
  };

  useEffect(() => {
    document.title = meta.title;
    
    const updateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    updateMeta('description', meta.description);
    updateMeta('og:title', meta.title, true);
    updateMeta('og:description', meta.description, true);
    updateMeta('og:url', meta.url, true);
    updateMeta('og:image', meta.image, true);
    updateMeta('og:type', meta.type, true);
    updateMeta('twitter:title', meta.title);
    updateMeta('twitter:description', meta.description);
    updateMeta('twitter:image', meta.image);
    updateMeta('twitter:url', meta.url);
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', meta.url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', meta.url);
      document.head.appendChild(canonical);
    }

    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow');
    }
  }, [meta.title, meta.description, meta.image, meta.url, meta.type, noIndex]);

  return null;
}

export function PropertySEO({ property }) {
  if (!property) return null;
  
  const title = `${property.title} | White Caves Real Estate Dubai`;
  const description = `${property.beds} bed ${property.type} in ${property.location}. ${property.description?.slice(0, 100)}... Price: AED ${property.price?.toLocaleString()}`;
  
  return (
    <SEO 
      title={title}
      description={description}
      type="product"
    />
  );
}

export function generatePropertySchema(property) {
  if (!property) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://whitecaves.com/property/${property.id}`,
    "image": property.images?.[0] || '/company-logo.jpg',
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": "Dubai",
      "addressCountry": "AE"
    },
    "numberOfRooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "FTK"
    }
  };
}
