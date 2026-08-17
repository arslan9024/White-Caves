/**
 * NinaMaryIntelligence
 * Enhances Nina's chatbot responses with real-time Mary inventory data
 * Enables: "Do you have 2BR villas with pools under 2.5M in Arabian Ranches?"
 */

import PropertyQueryService from './PropertyQueryService.js';

class NinaMaryIntelligence {
  constructor() {
    this.propertyQueryService = new PropertyQueryService();
    this.responseCache = new Map();
    this.cacheExpiry = 300000; // 5 minutes
  }

  /**
   * Enhanced response generation incorporating inventory data
   * Replaces old generateResponse that didn't have property info
   */
  async generateEnhancedResponse(userMessage, intent, entities, conversationContext = {}) {
    try {
      // Check if this is a property inquiry
      if (!this.isPropertyInquiry(intent)) {
        return this.generateGeneralResponse(intent, entities);
      }

      // Check cache first
      const cacheKey = `${userMessage.substring(0, 30)}`;
      if (this.responseCache.has(cacheKey)) {
        const cached = this.responseCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheExpiry) {
          return cached.response;
        }
      }

      // Search properties based on user inquiry
      const searchResult = await this.propertyQueryService.searchPropertiesNaturalLanguage(
        userMessage,
        5 // Return top 5 matches
      );

      // Generate response incorporating search results
      let response;
      if (searchResult.success && searchResult.properties.length > 0) {
        response = this.generatePropertyMatchResponse(searchResult, userMessage);
      } else {
        response = this.generateNoMatchResponse(userMessage, searchResult.query_filters);
      }

      // Cache the response
      this.responseCache.set(cacheKey, {
        response,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      
      return {
        type: 'error',
        text: 'I encountered an issue searching our inventory. Please contact our sales team for assistance.',
        error: error.message
      };
    }
  }

  /**
   * Check if user message is a property inquiry
   */
  isPropertyInquiry(intent) {
    const propertyIntents = [
      'property_inquiry',
      'viewing_request',
      'price_inquiry',
      'property_details',
      'availability_check'
    ];
    return propertyIntents.includes(intent);
  }

  /**
   * Generate response with property matches
   */
  generatePropertyMatchResponse(searchResult, originalQuery) {
    const { properties, count } = searchResult;

    // Build response with property details
    let responseText = `Great! I found ${count} matching propert${count === 1 ? 'y' : 'ies'}:\n\n`;

    properties.forEach((prop, index) => {
      responseText += `${index + 1}. ${prop.description}\n`;
      
      // Add key features
      if (prop.features && prop.features.length > 0) {
        responseText += `   Features: ${prop.features.join(', ')}\n`;
      }
      
      responseText += `   📍 ${prop.area}\n`;
    });

    responseText += `\nWould you like more details about any of these properties, or would you like to schedule a viewing? 🏠`;

    return {
      type: 'property_list',
      text: responseText,
      properties: properties.map(p => ({
        id: p.id,
        description: p.description,
        area: p.area,
        type: p.type,
        image: p.images?.[0]
      })),
      actionButtons: [
        { text: 'More Details', value: 'more_details' },
        { text: 'Schedule Viewing', value: 'schedule_viewing' },
        { text: 'New Search', value: 'new_search' }
      ]
    };
  }

  /**
   * Generate response when no properties match
   */
  generateNoMatchResponse(query, filters) {
    let responseText = `I couldn't find properties matching exactly "${query}", but let me try some alternatives:\n\n`;

    // Suggest less restrictive filters
    responseText += `Here are some options:\n`;
    responseText += `• Would you be interested in a ${filters.minRooms || '1'}-${filters.maxRooms || '5'}BR property?\n`;
    
    if (filters.area) {
      responseText += `• Looking specifically for ${filters.area}, or open to other communities?\n`;
    }
    
    if (filters.maxPrice) {
      responseText += `• Your budget is ${this.formatPrice(filters.maxPrice)} - would a slightly higher price work?\n`;
    }

    responseText += `\nLet me know your preferences, and I can show you available options! 😊`;

    return {
      type: 'no_match_suggestions',
      text: responseText,
      suggestedFilters: filters,
      actionButtons: [
        { text: 'Adjust Budget', value: 'adjust_budget' },
        { text: 'Different Location', value: 'change_location' },
        { text: 'Any Property Type', value: 'flexible_type' },
        { text: 'Speak with Agent', value: 'human_agent' }
      ]
    };
  }

  /**
   * Generate response for non-property inquiries
   */
  generateGeneralResponse(intent, entities) {
    const responses = {
      greeting: 'Hello! 👋 Welcome to White Caves Real Estate. How can I help you today? Are you looking for a property to buy, rent, or just gathering information?',
      
      viewing_request: 'I\'d be happy to help you schedule a viewing! 📅 Can you tell me which property you\'re interested in, or would you like me to help you find the perfect property first?',
      
      documentation: 'We have comprehensive documentation available for all our properties, including floor plans, legal documents, and more. Which property would you like information about?',
      
      complaint: 'We\'re sorry to hear you\'re experiencing an issue. Our team is here to help! Please let us know more details about your concern, and we\'ll resolve it promptly.',
      
      opt_out: 'Thank you for reaching out. We respect your preference. You\'ll be removed from our communications list.',
      
      thank_you: 'You\'re welcome! Feel free to reach out anytime if you need more information. We\'re here to help! 😊',
      
      urgency: 'I understand this is urgent! Let me connect you with an available agent right away who can assist you immediately.',
      
      default: 'Thank you for your message! Our team will get back to you shortly with the information you need.'
    };

    return {
      type: 'text',
      text: responses[intent] || responses.default,
      intent: intent
    };
  }

  /**
   * Format price for display
   */
  formatPrice(price) {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `AED ${(price / 1000).toFixed(0)}K`;
    }
    return `AED ${price}`;
  }

  /**
   * Handle follow-up questions about properties
   */
  async handlePropertyFollowUp(propertyId, question) {
    try {
      const property = await this.propertyQueryService.getPropertyDetails(propertyId);

      if (!property.success) {
        return {
          type: 'error',
          text: 'Unable to retrieve property details. Please try again.'
        };
      }

      const prop = property.property;
      let responseText = '';

      // Categorize follow-up questions
      if (this.isAboutPrice(question)) {
        responseText = `The asking price for this property is ${this.formatPrice(prop.askingPrice)}. `;
        if (prop.currency !== 'AED') {
          responseText += `(Currency: ${prop.currency}) `;
        }
        responseText += 'Would you like information about financing options?';
      } else if (this.isAboutSize(question)) {
        responseText = `This property is ${prop.actualArea} ${prop.areaUnit}. `;
        if (prop.rooms) {
          responseText += `It has ${prop.rooms} bedrooms. `;
        }
        responseText += 'Would you like to know more details?';
      } else if (this.isAboutAvailability(question)) {
        responseText = `This property is currently ${(prop.marketAvailability || 'available').replace('_', ' ')}. `;
        if (prop.occupancyStatus) {
          responseText += `Status: ${String(prop.occupancyStatus).replace('_', ' ')}. `;
        }
        responseText += 'Would you like to schedule a viewing?';
      } else if (this.isAboutLocation(question)) {
        responseText = `This property is located in ${prop.area || 'Dubai'}`;
        if (prop.cluster) {
          responseText += `, ${prop.cluster}`;
        }
        responseText += `. It's a great community with excellent amenities!`;
      } else {
        responseText = `Here's more information about this ${prop.propertyType || 'Property'}:\n`;
        responseText += `• Location: ${prop.area || 'Dubai'}\n`;
        responseText += `• Size: ${prop.actualArea || 0} ${prop.areaUnit || 'sq.ft'}\n`;
        responseText += `• Bedrooms: ${prop.rooms || 'Studio'}\n`;
        responseText += `• Price: ${this.formatPrice(prop.askingPrice)}\n`;
        responseText += `• Furnishing: ${(prop.furnishingLevel || 'unfurnished').replace('_', ' ')}\n`;
      }

      return {
        type: 'property_detail',
        text: responseText,
        propertyId: propertyId,
        property: prop
      };
    } catch (error) {
      
      return {
        type: 'error',
        text: 'I encountered an issue retrieving those details. Please ask our agent for help.'
      };
    }
  }

  /**
   * Question classification helpers
   */
  isAboutPrice(question) {
    const priceKeywords = ['price', 'cost', 'how much', 'expense', 'rate', 'per month', 'per year'];
    return priceKeywords.some(kw => question.toLowerCase().includes(kw));
  }

  isAboutSize(question) {
    const sizeKeywords = ['size', 'area', 'sqft', 'square', 'bedroom', 'bathroom', 'big', 'large', 'space'];
    return sizeKeywords.some(kw => question.toLowerCase().includes(kw));
  }

  isAboutAvailability(question) {
    const availKeywords = ['available', 'ready', 'occupied', 'when', 'vacant', 'free', 'open'];
    return availKeywords.some(kw => question.toLowerCase().includes(kw));
  }

  isAboutLocation(question) {
    const locKeywords = ['where', 'location', 'area', 'community', 'neighborhood', 'address', 'region'];
    return locKeywords.some(kw => question.toLowerCase().includes(kw));
  }

  /**
   * Generate property recommendations based on conversation
   */
  async getConversationBasedRecommendations(conversationHistory) {
    try {
      // Analyze conversation to infer preferences
      const preferences = this.inferPreferencesFromConversation(conversationHistory);

      // Query properties matching inferred preferences
      const result = await this.propertyQueryService.queryProperties(preferences);

      if (result.success && result.data.length > 0) {
        return {
          success: true,
          recommendations: result.data,
          basis: preferences,
          message: 'Based on our conversation, I think you might like these properties:'
        };
      }

      return {
        success: false,
        message: 'No properties found matching your preferences. Would you like to adjust your criteria?'
      };
    } catch (error) {
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Infer user preferences from conversation
   */
  inferPreferencesFromConversation(messages) {
    const preferences = {};

    const conversationText = messages.map(m => m.text || '').join(' ').toLowerCase();

    // Extract preferences from conversation
    const priceMatch = conversationText.match(/(\d+(?:\.\d+)?)\s*[mk](?:illions?)?/i);
    if (priceMatch) {
      const priceStr = priceMatch[1] + (conversationText.includes('m') ? 'M' : 'K');
      preferences.maxPrice = this.propertyQueryService.parsePrice(priceStr);
    }

    // Extract room preference
    const roomMatch = conversationText.match(/(\d)[\s-]?br(?:edroom)?/i);
    if (roomMatch) {
      preferences.minRooms = parseInt(roomMatch[1]);
      preferences.maxRooms = parseInt(roomMatch[1]) + 1;
    }

    // Extract property type
    if (conversationText.includes('villa')) preferences.propertyType = 'villa';
    else if (conversationText.includes('apartment')) preferences.propertyType = 'apartment';
    else if (conversationText.includes('townhouse')) preferences.propertyType = 'townhouse';

    return preferences;
  }

  /**
   * Clear response cache periodically
   */
  clearOldCacheEntries() {
    const now = Date.now();
    for (const [key, value] of this.responseCache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.responseCache.delete(key);
      }
    }
  }
}

export default NinaMaryIntelligence;
