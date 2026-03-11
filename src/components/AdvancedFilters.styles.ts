import styled from 'styled-components';

export const AdvancedFiltersContainer = styled.div`
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  overflow: hidden;
  max-height: 80vh;
`;

export const FiltersHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  h3 {
    margin: 0;
    color: white;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const FilterIcon = styled.span`
  font-size: 20px;
`;

export const FilterCountBadge = styled.span`
  background: linear-gradient(135deg, #D4AF37, #B8860B);
  color: #0a0a0f;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  margin-left: 8px;
`;

export const FiltersActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ResetBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const CloseFiltersBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 100, 100, 0.3);
  }
`;

export const FiltersBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  max-height: calc(80vh - 100px);
`;

export const FilterSectionContainer = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const Chevron = styled.span<{ open?: boolean }>`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;

  ${({ open }) => open && `transform: rotate(180deg);`}
`;

export const SectionContent = styled.div`
  padding: 0 24px 20px;
`;

export const PriceInputsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const PriceInputGroupStyled = styled.div`
  flex: 1;
`;

export const InputLabel = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 6px;
`;

export const NumberInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #D4AF37;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const Separator = styled.span`
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 10px;
  font-weight: 500;
`;

export const PriceSliderContainer = styled.div`
  position: relative;
  height: 40px;
  margin-top: 10px;
`;

export const PriceSlider = styled.input`
  position: absolute;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #D4AF37, #B8860B);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid white;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #D4AF37, #B8860B);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid white;
  }
`;

export const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
`;

export const ListingTypeToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ToggleBtn = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  ${({ active }) => active && `
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(184, 134, 11, 0.3));
    border-color: #D4AF37;
    color: #D4AF37;
  `}
`;

export const PropertyTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TypeBtn = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  ${({ active }) => active && `
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.2));
    border-color: #D4AF37;
    color: #D4AF37;
  `}
`;

export const TypeIcon = styled.span`
  font-size: 24px;
`;

export const TypeLabel = styled.span`
  font-size: 12px;
`;

export const RoomSelector = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const RoomLabel = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin-bottom: 10px;
`;

export const RoomButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const RoomBtn = styled.button<{ active?: boolean }>`
  min-width: 40px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  ${({ active }) => active && `
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(184, 134, 11, 0.3));
    border-color: #D4AF37;
    color: #D4AF37;
  `}
`;

export const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const AmenityBtn = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  ${({ active }) => active && `
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.2));
    border-color: #D4AF37;
    color: #D4AF37;
  `}
`;

export const AmenityIcon = styled.span`
  font-size: 16px;
`;

export const ApplyBtn = styled.button`
  padding: 14px 28px;
  width: 100%;
  background: linear-gradient(135deg, #D4AF37, #B8860B);
  color: #0a0a0f;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
