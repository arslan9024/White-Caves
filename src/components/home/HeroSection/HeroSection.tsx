import React, { FC } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { useHeroSectionLogic } from './HeroSection.logic';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  HeroWrapper,
  DecorativeOrb,
  HeroContent,
  BadgeTag,
  HeroTitle,
  HeroSubtitle,
  SearchForm,
  CommunityPillsWrapper,
  CommunityPill,
} from './HeroSection.style';

export const HeroSection: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    selectTag,
    handleSearchSubmit,
    destinationTags,
  } = useHeroSectionLogic();

  const { t } = useTranslation();

  return (
    <HeroWrapper data-testid="hero-section">
      <DecorativeOrb />

      <HeroContent>
        <BadgeTag>
          <Sparkles size={14} /> {t('hero.badge')}
        </BadgeTag>

        <HeroTitle>
          {t('hero.title_main')} <span>{t('hero.title_highlight')}</span>
        </HeroTitle>

        <HeroSubtitle>
          {t('hero.subtitle')}
        </HeroSubtitle>

        <SearchForm onSubmit={handleSearchSubmit}>
          <Search size={20} color="#EF4444" />
          <input
            type="text"
            placeholder={t('hero.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">{t('hero.search_btn')}</button>
        </SearchForm>

        <CommunityPillsWrapper>
          <span className="label">{t('hero.popular_communities')}</span>
          {destinationTags.map((tag) => (
            <CommunityPill
              key={tag}
              type="button"
              $active={selectedTag === tag}
              onClick={() => selectTag(tag)}
            >
              <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {tag}
            </CommunityPill>
          ))}
        </CommunityPillsWrapper>
      </HeroContent>
    </HeroWrapper>
  );
};

export default HeroSection;

export default HeroSection;
