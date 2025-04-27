
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  filteredProperties: [],
  filters: {
    search: '',
    minPrice: '',
    maxPrice: '',
    beds: 'any',
    location: '',
    minSqft: '',
    maxSqft: '',
    amenities: []
  }
};

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    applyFilters: (state) => {
      state.filteredProperties = state.properties.filter(property => {
        const matchesSearch = !state.filters.search || 
          property.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          property.location.toLowerCase().includes(state.filters.search.toLowerCase());
        
        const matchesMinPrice = !state.filters.minPrice || property.price >= parseInt(state.filters.minPrice);
        const matchesMaxPrice = !state.filters.maxPrice || property.price <= parseInt(state.filters.maxPrice);
        const matchesBeds = state.filters.beds === 'any' || property.beds >= parseInt(state.filters.beds);
        const matchesLocation = !state.filters.location || 
          property.location.toLowerCase().includes(state.filters.location.toLowerCase());
        const matchesMinSqft = !state.filters.minSqft || property.sqft >= parseInt(state.filters.minSqft);
        const matchesMaxSqft = !state.filters.maxSqft || property.sqft <= parseInt(state.filters.maxSqft);
        const matchesAmenities = state.filters.amenities.length === 0 || 
          state.filters.amenities.every(amenity => property.amenities.includes(amenity));

        return matchesSearch && matchesMinPrice && matchesMaxPrice && 
               matchesBeds && matchesLocation && matchesMinSqft && 
               matchesMaxSqft && matchesAmenities;
      });
    }
  }
});

export const { setProperties, setFilters, applyFilters } = propertySlice.actions;
export default propertySlice.reducer;
