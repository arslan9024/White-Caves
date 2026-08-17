/**
 * FloatingHeroSearchPill.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational markup drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { Search } from 'lucide-react';
import { useFloatingHeroSearchPillLogic } from './logic/FloatingHeroSearchPill.logic';
import { SEARCH_PILL_TEXT } from './data/FloatingHeroSearchPill.data';
import {
  Container,
  TabsRow,
  TabBtn,
  SearchGrid,
  Field,
  Label,
  Input,
  Select,
  SearchBtn,
  SuggestionText,
} from './styles/FloatingHeroSearchPill.style';

export const FloatingHeroSearchPill: FC = () => {
  const {
    activeTab,
    setActiveTab,
    location,
    setLocation,
    propertyType,
    setPropertyType,
    priceRange,
    setPriceRange,
    handleSearch,
    tabs,
    propertyTypes,
    priceRanges,
  } = useFloatingHeroSearchPillLogic();

  return (
    <Container data-testid="floating-hero-search-pill">
      <TabsRow>
        {tabs.map(tab => (
          <TabBtn
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`search-tab-${tab.id}`}
          >
            {tab.label}
          </TabBtn>
        ))}
      </TabsRow>

      <form onSubmit={handleSearch}>
        <SearchGrid>
          <Field>
            <Label>{SEARCH_PILL_TEXT.locationLabel}</Label>
            <Input
              type="text"
              placeholder={SEARCH_PILL_TEXT.locationPlaceholder}
              value={location}
              onChange={e => setLocation(e.target.value)}
              data-testid="hero-location-input"
            />
          </Field>

          <Field>
            <Label>{SEARCH_PILL_TEXT.typeLabel}</Label>
            <Select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              data-testid="hero-type-select"
            >
              {propertyTypes.map(pt => (
                <option key={pt.id} value={pt.id}>
                  {pt.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>{SEARCH_PILL_TEXT.budgetLabel}</Label>
            <Select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              data-testid="hero-budget-select"
            >
              {priceRanges.map(pr => (
                <option key={pr.id} value={pr.id}>
                  {pr.label}
                </option>
              ))}
            </Select>
          </Field>

          <SearchBtn type="submit" data-testid="hero-search-submit-btn">
            <Search size={16} />
            <span>{SEARCH_PILL_TEXT.searchButton}</span>
          </SearchBtn>
        </SearchGrid>
      </form>

      <SuggestionText>
        <span>💡</span>
        <span>{SEARCH_PILL_TEXT.quickSuggestion}</span>
      </SuggestionText>
    </Container>
  );
};

export default FloatingHeroSearchPill;
