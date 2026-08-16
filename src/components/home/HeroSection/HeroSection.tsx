import React, { FC } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { useHeroSectionLogic } from './HeroSection.logic';
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

  return (
    <HeroWrapper data-testid="hero-section">
      <DecorativeOrb />

      <HeroContent>
        <BadgeTag>
          <Sparkles size={14} /> White Caves Sovereign Real Estate Dubai
        </BadgeTag>

        <HeroTitle>
          Discover Dubai's Most Exclusive <span>Villas & Penthouses</span>
        </HeroTitle>

        <HeroSubtitle>
          Explore live DLD verified listings across Palm Jumeirah, Downtown Dubai, and DAMAC Hills 2 managed directly by our 12 Corporate Departments.
        </HeroSubtitle>

        <SearchForm onSubmit={handleSearchSubmit}>
          <Search size={20} color="#EF4444" />
          <input
            type="text"
            placeholder="Search Palm Jumeirah Villa, Downtown Penthouse, DAMAC Hills 2..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search Market</button>
        </SearchForm>

        <CommunityPillsWrapper>
          <span className="label">Popular Communities:</span>
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
