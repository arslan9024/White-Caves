import React, { useState, useRef, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import UniversalProfile from './layout/UniversalProfile';
import * as S from './MegaNav.styles';

interface MenuItemSubmenu {
  featured?: Array<{ title: string; desc: string; icon: string }>;
  propertyTypes?: string[];
  developers?: string[];
  locations: string[];
  priceRanges?: string[];
  paymentPlans?: string[];
}

interface MenuItem {
  label: string;
  submenu: MenuItemSubmenu;
}

interface SimpleLink {
  label: string;
  href: string;
  isRoute: boolean;
}

interface MegaNavProps {
  user?: {
    id: string;
    name?: string;
    displayName?: string;
    email: string;
    role?: string;
    photoURL?: string;
  } | null;
}

const MegaNav: FC<MegaNavProps> = ({ user }) => {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Buy',
      submenu: {
        featured: [
          { title: 'New Listings', desc: 'Latest properties on the market', icon: '🏠' },
          { title: 'Luxury Homes', desc: 'Premium villas & penthouses', icon: '✨' },
          { title: 'Investment Properties', desc: 'High ROI opportunities', icon: '📈' },
        ],
        propertyTypes: ['Villas', 'Apartments', 'Penthouses', 'Townhouses', 'Land'],
        locations: ['Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills', 'Dubai Marina', 'Arabian Ranches'],
        priceRanges: ['Under 5M AED', '5M - 15M AED', '15M - 30M AED', '30M+ AED'],
      }
    },
    {
      label: 'Rent',
      submenu: {
        featured: [
          { title: 'Move-in Ready', desc: 'Available immediately', icon: '🔑' },
          { title: 'Furnished Homes', desc: 'Fully equipped properties', icon: '🛋️' },
          { title: 'Short Term', desc: 'Flexible rental options', icon: '📅' },
        ],
        propertyTypes: ['Villas', 'Apartments', 'Penthouses', 'Townhouses', 'Studios'],
        locations: ['JBR', 'Dubai Marina', 'Business Bay', 'DIFC', 'City Walk'],
        priceRanges: ['Under 100K/yr', '100K - 250K/yr', '250K - 500K/yr', '500K+/yr'],
      }
    },
    {
      label: 'Commercial',
      submenu: {
        featured: [
          { title: 'Office Spaces', desc: 'Premium work environments', icon: '🏢' },
          { title: 'Retail Units', desc: 'High-traffic locations', icon: '🏪' },
          { title: 'Warehouses', desc: 'Industrial & logistics', icon: '🏭' },
        ],
        propertyTypes: ['Offices', 'Retail', 'Warehouses', 'Mixed Use', 'Land'],
        locations: ['DIFC', 'Business Bay', 'JLT', 'Dubai South', 'Jebel Ali'],
        priceRanges: ['Under 1M AED', '1M - 5M AED', '5M - 20M AED', '20M+ AED'],
      }
    },
    {
      label: 'New Projects',
      submenu: {
        featured: [
          { title: 'Off-Plan', desc: 'Pre-launch opportunities', icon: '🏗️' },
          { title: 'Under Construction', desc: 'Projects in progress', icon: '🔨' },
          { title: 'Ready Soon', desc: 'Completing this year', icon: '🎯' },
        ],
        developers: ['Emaar', 'DAMAC', 'Meraas', 'Nakheel', 'Dubai Properties'],
        locations: ['Dubai Creek Harbour', 'MBR City', 'Dubai Hills', 'The Valley', 'Dubai South'],
        paymentPlans: ['10% Down', '20% Down', 'Post-Handover', '5-Year Plan'],
      }
    },
  ];

  const simpleLinks: SimpleLink[] = [
    { label: 'About', href: '/about', isRoute: true },
    { label: 'Services', href: '/services', isRoute: true },
    { label: 'Careers', href: '/careers', isRoute: true },
    { label: 'Contact', href: '/contact', isRoute: true },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuEnter = (index: number) => {
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <S.MegaNavHeader ref={navRef}>
      <S.MegaNav>
        <S.MegaNavContainer>
          <S.MegaNavLogo to="/">
            <S.LogoImage src="/company-logo.jpg" alt="White Caves" />
          </S.MegaNavLogo>

          <S.MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
            <S.HamburgerIcon $open={mobileOpen}>
              <span></span>
              <span></span>
              <span></span>
            </S.HamburgerIcon>
          </S.MobileMenuButton>

          <S.MegaNavMenu $mobileOpen={mobileOpen}>
            <S.MegaNavList>
              {menuItems.map((item, index) => (
                <S.MegaNavItem 
                  key={item.label}
                  onMouseEnter={() => handleMenuEnter(index)}
                  onMouseLeave={handleMenuLeave}
                >
                  <S.MegaNavTrigger>
                    {item.label}
                    <S.DropdownArrow viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </S.DropdownArrow>
                  </S.MegaNavTrigger>

                  <S.MegaDropdown $active={activeMenu === index}>
                    <S.MegaDropdownContent>
                      <S.MegaFeatured>
                        <h4>Featured</h4>
                        <S.FeaturedList>
                          {item.submenu.featured?.map((feat) => (
                            <S.FeaturedItem as="div" role="menuitem" tabIndex={0} key={feat.title} style={{ cursor: 'pointer' }}>
                              <S.FeaturedIcon>{feat.icon}</S.FeaturedIcon>
                              <S.FeaturedText>
                                <S.FeaturedTitle>{feat.title}</S.FeaturedTitle>
                                <S.FeaturedDesc>{feat.desc}</S.FeaturedDesc>
                              </S.FeaturedText>
                            </S.FeaturedItem>
                          ))}
                        </S.FeaturedList>
                      </S.MegaFeatured>

                      <S.MegaCol>
                        <h4>{item.submenu.propertyTypes ? 'Property Types' : 'Developers'}</h4>
                        <S.MegaLinks>
                          {(item.submenu.propertyTypes || item.submenu.developers || []).map((type) => (
                            <li key={type} role="none"><a href={`/properties?type=${encodeURIComponent(type)}`} role="menuitem">{type}</a></li>
                          ))}
                        </S.MegaLinks>
                      </S.MegaCol>

                      <S.MegaCol>
                        <h4>Locations</h4>
                        <S.MegaLinks>
                          {item.submenu.locations.map((loc) => (
                            <li key={loc} role="none"><a href={`/properties?location=${encodeURIComponent(loc)}`} role="menuitem">{loc}</a></li>
                          ))}
                        </S.MegaLinks>
                      </S.MegaCol>

                      <S.MegaCol>
                        <h4>{item.submenu.priceRanges ? 'Price Range' : 'Payment Plans'}</h4>
                        <S.MegaLinks>
                          {(item.submenu.priceRanges || item.submenu.paymentPlans || []).map((val) => (
                            <li key={val} role="none"><a href={`/properties?filter=${encodeURIComponent(val)}`} role="menuitem">{val}</a></li>
                          ))}
                        </S.MegaLinks>
                      </S.MegaCol>

                      <S.MegaCTA>
                        <S.MegaCTAContent>
                          <h4>Need Help Finding a Property?</h4>
                          <p>Our experts are ready to assist you</p>
                          <a href="#contact">Contact Us</a>
                        </S.MegaCTAContent>
                      </S.MegaCTA>
                    </S.MegaDropdownContent>
                  </S.MegaDropdown>
                </S.MegaNavItem>
              ))}

              {simpleLinks.map((link) => (
                <S.MegaNavItem key={link.label} $isSimple>
                  {link.isRoute ? (
                    <S.MegaNavLink to={link.href}>{link.label}</S.MegaNavLink>
                  ) : (
                    <S.MegaNavTrigger as="a" href={link.href}>{link.label}</S.MegaNavTrigger>
                  )}
                </S.MegaNavItem>
              ))}
            </S.MegaNavList>

            <S.MegaNavActions>
              <ThemeToggle />
              <UniversalProfile />
            </S.MegaNavActions>
          </S.MegaNavMenu>
        </S.MegaNavContainer>
      </S.MegaNav>
    </S.MegaNavHeader>
  );
};

export default MegaNav;
