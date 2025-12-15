import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  filteredProperties: [],
  filters: {
    search: '',
    minPrice: 0,
    maxPrice: 100000000,
    beds: 0,
    baths: 0,
    propertyTypes: [],
    locations: [],
    amenities: [],
    minSqft: 0,
    maxSqft: 20000,
    sortBy: 'featured'
  }
};

const sortProperties = (properties, sortBy) => {
  const sorted = [...properties];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'sqft_desc':
      return sorted.sort((a, b) => b.sqft - a.sqft);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'featured':
    default:
      return sorted;
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
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        minPrice: 0,
        maxPrice: 100000000,
        beds: 0,
        baths: 0,
        propertyTypes: [],
        locations: [],
        amenities: [],
        minSqft: 0,
        maxSqft: 20000,
        sortBy: 'featured'
      };
      state.filteredProperties = state.properties;
    },
    applyFilters: (state) => {
      let filtered = state.properties.filter(property => {
        const matchesSearch = !state.filters.search || 
          property.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          property.location.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          property.type.toLowerCase().includes(state.filters.search.toLowerCase());
        
        const matchesMinPrice = state.filters.minPrice === 0 || property.price >= state.filters.minPrice;
        const matchesMaxPrice = state.filters.maxPrice === 100000000 || property.price <= state.filters.maxPrice;
        
        const matchesBeds = state.filters.beds === 0 || property.beds >= state.filters.beds;
        const matchesBaths = state.filters.baths === 0 || property.baths >= state.filters.baths;
        
        const matchesPropertyTypes = state.filters.propertyTypes.length === 0 || 
          state.filters.propertyTypes.includes(property.type);
        
        const matchesLocations = state.filters.locations.length === 0 || 
          state.filters.locations.includes(property.location);
        
        const matchesAmenities = state.filters.amenities.length === 0 || 
          state.filters.amenities.every(amenity => property.amenities.includes(amenity));
        
        const matchesMinSqft = state.filters.minSqft === 0 || property.sqft >= state.filters.minSqft;
        const matchesMaxSqft = state.filters.maxSqft === 20000 || property.sqft <= state.filters.maxSqft;

        return matchesSearch && matchesMinPrice && matchesMaxPrice && 
               matchesBeds && matchesBaths && matchesPropertyTypes && 
               matchesLocations && matchesAmenities && matchesMinSqft && matchesMaxSqft;
      });

      state.filteredProperties = sortProperties(filtered, state.filters.sortBy);
    }
  }
});

export const { setProperties, setFilters, clearFilters, applyFilters } = propertySlice.actions;
export default propertySlice.reducer;
