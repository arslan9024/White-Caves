import React, { FC } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, Award, Building } from 'lucide-react';
import { useHeroSectionLogic } from './HeroSection.logic';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  HeroWrapper,
  DecorativeOrb,
  HeroContent,
  BadgeTag,
  HeroTitle,
  HeroSubtitle,
  SearchFormWrapper,
  SearchForm,
  FilterSelect,
  AutocompleteDropdown,
  CommunityPillsWrapper,
  CommunityPill,
  TrustBadgesWrapper,
  TrustBadge,
  FloatingPropertyBadge,
} from './HeroSection.style';

export const HeroSection: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    selectTag,
    handleSearchSubmit,
    destinationTags,
    theme,
    toggleTheme,
    searchType,
    setSearchType,
    showAutocomplete,
    setShowAutocomplete,
    propertyCount,
  } = useHeroSectionLogic();

  const { t } = useTranslation();

  return (
    <HeroWrapper $theme={theme} data-testid="hero-section">
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
          color: theme === 'dark' ? '#FFF' : '#1E293B', padding: '8px 16px', borderRadius: '999px', cursor: 'pointer'
        }}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <FloatingPropertyBadge $theme={theme} aria-live="polite">
        <span className="count">{propertyCount.toLocaleString()}+</span>
        <span className="label">Live Properties</span>
      </FloatingPropertyBadge>

      <DecorativeOrb />

      <HeroContent>
        <BadgeTag>
          <Sparkles size={14} aria-hidden="true" /> {t('hero.badge')}
        </BadgeTag>

        <HeroTitle>
          {t('hero.title_main')} <span>{t('hero.title_highlight')}</span>
        </HeroTitle>

        <HeroSubtitle $theme={theme}>
          {t('hero.subtitle')}
        </HeroSubtitle>

        <SearchFormWrapper>
          <SearchForm role="search" aria-label="Property Search" onSubmit={handleSearchSubmit}>
            <FilterSelect 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value as 'buy' | 'rent')}
              aria-label="Filter by transaction type"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </FilterSelect>
            <Search size={20} color="#EF4444" aria-hidden="true" />
            <input
              type="text"
              id="hero-search-input"
              aria-label={t('hero.search_placeholder') || "Search for properties"}
              placeholder={t('hero.search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAutocomplete(e.target.value.length > 1);
              }}
              onFocus={() => setShowAutocomplete(searchTerm.length > 1)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              style={{ color: '#1E293B' }}
              autoComplete="off"
            />
            <button type="submit" aria-label={t('hero.search_btn') || "Search"}>{t('hero.search_btn')}</button>
          </SearchForm>

          {showAutocomplete && destinationTags.length > 0 && (
            <AutocompleteDropdown>
              <ul>
                {destinationTags
                  .filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(tag => (
                    <li key={tag} onClick={() => { selectTag(tag); setShowAutocomplete(false); handleSearchSubmit(new Event('submit') as unknown as React.FormEvent); }}>
                      <MapPin size={16} color="#94A3B8" /> {tag}
                    </li>
                  ))}
              </ul>
            </AutocompleteDropdown>
          )}
        </SearchFormWrapper>

        <CommunityPillsWrapper $theme={theme} role="group" aria-label="Popular Communities">
          <span className="label" aria-hidden="true">{t('hero.popular_communities')}</span>
          {destinationTags.map((tag) => (
            <CommunityPill
              key={tag}
              type="button"
              $active={selectedTag === tag}
              $theme={theme}
              aria-pressed={selectedTag === tag}
              onClick={() => selectTag(tag)}
            >
              <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} aria-hidden="true" />
              {tag}
            </CommunityPill>
          ))}
        </CommunityPillsWrapper>
        <TrustBadgesWrapper>
          <TrustBadge $theme={theme}>
            <Building size={16} color="#EF4444" aria-hidden="true" />
            DET Registered
          </TrustBadge>
          <TrustBadge $theme={theme}>
            <Award size={16} color="#EF4444" aria-hidden="true" />
            RERA ORN 12345
          </TrustBadge>
          <TrustBadge $theme={theme}>
            <ShieldCheck size={16} color="#EF4444" aria-hidden="true" />
            DLD Approved Broker
          </TrustBadge>
        </TrustBadgesWrapper>
      </HeroContent>
    </HeroWrapper>
  );
};

export default HeroSection;
