/**
 * ConversationAnalyzer Service
 * Analyzes WhatsApp conversations for property opportunities
 * Extracts entities, calculates confidence scores, and identifies property owners
 */

class ConversationAnalyzer {
  constructor() {
    // Property-related keywords organized by category
    this.keywords = {
      propertyTypes: {
        villa: ['villa', 'standalone', 'detached house', 'single villa'],
        apartment: ['apartment', 'flat', 'apt', 'appt', 'flats'],
        townhouse: ['townhouse', 'town house', 'terrace house'],
        penthouse: ['penthouse', 'pent house', 'pent-house'],
        duplex: ['duplex', 'semi-detached'],
        studio: ['studio', 'studio apartment'],
        plot: ['plot', 'land', 'plot of land'],
        chalet: ['chalet', 'chalet compound'],
        other: ['property', 'house', 'building', 'unit', 'residence', 'home']
      },

      availability: {
        forRent: ['for rent', 'for rental', 'rent out', 'renting', 'available for rent', 'lease', 'leasing', 'to rent', 'rent this', 'tenant wanted'],
        forSale: ['for sale', 'selling', 'available for sale', 'for sell', 'sell this', 'buyer needed', 'sale', 'to sell', 'available to buy'],
        bothOptions: ['for rent or sale', 'rent or sale', 'rent and sale', 'both rent and sale']
      },

      locationKeywords: [
        'arabian ranches', 'downtown', 'marina', 'jlt', 'jumeirah',
        'dubai hills', 'creek harbour', 'motor city', 'Dubai Sports City',
        'deira', 'bur dubai', 'sheikh zayed road', 'palm jumeirah',
        'the palm', 'business bay', 'difc', 'dubai investment park',
        'al barsha', 'tecom', 'damac', 'jbr', 'beach front',
        'dubai silicon oasis', 'dso', 'meadows', 'springs',
        'emirates living', 'greens', 'dubai land', 'ghaf',
        'al khail', 'al tayer', 'remraam', 'damac hills',
        'arjan', 'jebel ali', 'hatta'
      ],

      ownershipIndicators: {
        owner: ['owner', 'landlord', 'landlady', 'proprietor', 'i own', 'my property', 'my villa', 'my apartment', 'my place'],
        propertyManager: ['property manager', 'managing', 'manage', 'on behalf of', 'representative'],
        broker: ['broker', 'agent', 'real estate', 'brokerage', 'dealing'],
        uncertain: ['family property', 'inherited', 'thinking of', 'considering', 'might sell', 'might rent']
      },

      priceIndicators: ['price', 'aed', 'cost', 'monthly', 'annual', 'yearly', 'rent', 'asking', 'price per', 'per month', 'per year', 'per sqft', 'per sqm'],

      sizeIndicators: ['rooms', 'bedroom', 'bedrooms', 'br', 'bed', 'sqft', 'sqm', 'square', 'area', 'plot size', 'land area'],

      furnishingIndicators: {
        furnished: ['furnished', 'fully furnished', 'complete furniture', 'with furniture'],
        semiFurnished: ['semi-furnished', 'semi furnished', 'partly furnished', 'partial furniture', 'basic furniture'],
        unfurnished: ['unfurnished', 'bare', 'empty', 'shell', 'bare walls', 'no furniture']
      },

      featureKeywords: [
        'pool', 'swimming', 'gym', 'parking', 'maid room', 'maids room',
        'garden', 'balcony', 'terrace', 'roof', 'workspace', 'office',
        'laundry', 'storage', 'ac', 'air condition', 'central ac',
        'furnished kitchen', 'equipped kitchen', 'built-in', 'open plan',
        'master bedroom', 'ensuite', 'walk-in', 'views', 'sea view',
        'marina view', 'golf view', 'golf course', 'gated', 'security',
        'playground', 'school', 'mall nearby', 'metro', 'beach'
      ]
    };

    this.confidenceWeights = {
      propertyTypeMentioned: 20,
      availabilityMentioned: 20,
      locationMentioned: 15,
      sizeOrRoomsMentioned: 15,
      priceMentioned: 15,
      ownerIdentified: 10,
      furnishingMentioned: 3,
      featuresListedCount: 2
    };
  }

  /**
   * Analyze conversation for property opportunities
   */
  analyzeConversation(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return { properties: [], overallConfidence: 0, reasoning: 'No messages provided' };
    }

    const analysis = {
      properties: [],
      overallConfidence: 0,
      ownerIdentification: null,
      extractedEntities: [],
      reasoning: ''
    };

    let currentProperty = null;
    let confidenceComponents = {
      propertyTypeMentioned: false,
      availabilityMentioned: false,
      locationMentioned: false,
      sizeOrRoomsMentioned: false,
      priceMentioned: false,
      ownerIdentified: false,
      furnishingMentioned: false,
      featuresCount: 0
    };

    const fullConversation = messages.map(m => m.content || m.text).join(' ').toLowerCase();

    // Step 1: Identify property type
    for (const [type, keywords] of Object.entries(this.keywords.propertyTypes)) {
      if (this.hasKeywords(fullConversation, keywords)) {
        currentProperty = { type, confidence: 0, extractedData: {} };
        confidenceComponents.propertyTypeMentioned = true;
        break;
      }
    }

    if (!currentProperty) {
      return {
        properties: [],
        overallConfidence: 0,
        reasoning: 'No property type keywords detected'
      };
    }

    // Step 2: Check availability
    let availabilityType = null;
    if (this.hasKeywords(fullConversation, this.keywords.availability.forRent)) {
      availabilityType = 'for_rent';
      confidenceComponents.availabilityMentioned = true;
    }
    if (this.hasKeywords(fullConversation, this.keywords.availability.forSale)) {
      availabilityType = availabilityType ? 'for_both' : 'for_sale';
      confidenceComponents.availabilityMentioned = true;
    }

    if (availabilityType) {
      currentProperty.extractedData.availability = availabilityType;
    }

    // Step 3: Extract location
    const location = this.extractLocation(fullConversation);
    if (location) {
      currentProperty.extractedData.location = location;
      confidenceComponents.locationMentioned = true;
    }

    // Step 4: Extract size/rooms
    const sizeData = this.extractSize(fullConversation);
    if (sizeData) {
      currentProperty.extractedData.size = sizeData;
      confidenceComponents.sizeOrRoomsMentioned = true;
    }

    // Step 5: Extract price
    const priceData = this.extractPrice(fullConversation);
    if (priceData) {
      currentProperty.extractedData.price = priceData;
      confidenceComponents.priceMentioned = true;
    }

    // Step 6: Identify owner
    const ownerData = this.identifyOwner(messages, fullConversation);
    if (ownerData) {
      currentProperty.extractedData.owner = ownerData;
      analysis.ownerIdentification = ownerData;
      confidenceComponents.ownerIdentified = true;
    }

    // Step 7: Extract furnishing
    const furnishing = this.extractFurnishing(fullConversation);
    if (furnishing) {
      currentProperty.extractedData.furnishing = furnishing;
      confidenceComponents.furnishingMentioned = true;
    }

    // Step 8: Extract features
    const features = this.extractFeatures(fullConversation);
    if (features.length > 0) {
      currentProperty.extractedData.features = features;
      confidenceComponents.featuresCount = features.length;
    }

    // Calculate confidence score
    currentProperty.confidence = this.calculateConfidence(confidenceComponents);
    currentProperty.confidenceComponents = confidenceComponents;

    analysis.properties.push(currentProperty);
    analysis.overallConfidence = currentProperty.confidence;
    analysis.extractedEntities = this.extractEntities(messages);

    return analysis;
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(components) {
    let score = 0;

    if (components.propertyTypeMentioned) score += this.confidenceWeights.propertyTypeMentioned;
    if (components.availabilityMentioned) score += this.confidenceWeights.availabilityMentioned;
    if (components.locationMentioned) score += this.confidenceWeights.locationMentioned;
    if (components.sizeOrRoomsMentioned) score += this.confidenceWeights.sizeOrRoomsMentioned;
    if (components.priceMentioned) score += this.confidenceWeights.priceMentioned;
    if (components.ownerIdentified) score += this.confidenceWeights.ownerIdentified;
    if (components.furnishingMentioned) score += this.confidenceWeights.furnishingMentioned;
    score += Math.min(components.featuresCount * this.confidenceWeights.featuresListedCount, 10);

    return Math.min(score, 100);
  }

  /**
   * Check if text has keywords
   */
  hasKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * Extract location from text
   */
  extractLocation(text) {
    for (const location of this.keywords.locationKeywords) {
      if (text.includes(location.toLowerCase())) {
        return location.charAt(0).toUpperCase() + location.slice(1);
      }
    }
    return null;
  }

  /**
   * Extract size information
   */
  extractSize(text) {
    const sizeData = {};

    const roomsPattern = /(\d+)\s*(?:br|bedroom|bedrooms|room|rooms)/gi;
    const roomsMatch = roomsPattern.exec(text);
    if (roomsMatch) {
      sizeData.rooms = parseInt(roomsMatch[1]);
    }

    const sqftPattern = /(\d+(?:,\d+)*)\s*(?:sqft|sq\.ft|square feet)/gi;
    const sqftMatch = sqftPattern.exec(text);
    if (sqftMatch) {
      sizeData.sqft = parseInt(sqftMatch[1].replace(/,/g, ''));
    }

    const sqmPattern = /(\d+(?:,\d+)*)\s*(?:sqm|sq\.m|square meters)/gi;
    const sqmMatch = sqmPattern.exec(text);
    if (sqmMatch) {
      sizeData.sqm = parseInt(sqmMatch[1].replace(/,/g, ''));
    }

    return Object.keys(sizeData).length > 0 ? sizeData : null;
  }

  /**
   * Extract price information
   */
  extractPrice(text) {
    const priceData = {};

    const monthlyPattern = /aed\s*(\d+(?:,\d+)*)\s*(?:per\s*month|\/month|monthly|\/m|pm)/gi;
    const monthlyMatch = monthlyPattern.exec(text);
    if (monthlyMatch) {
      priceData.monthlyRent = parseInt(monthlyMatch[1].replace(/,/g, ''));
      priceData.currency = 'AED';
    }

    const annualPattern = /aed\s*(\d+(?:,\d+)*)\s*(?:per\s*year|\/year|annually|pa)/gi;
    const annualMatch = annualPattern.exec(text);
    if (annualMatch) {
      priceData.annualRent = parseInt(annualMatch[1].replace(/,/g, ''));
      priceData.currency = 'AED';
    }

    return Object.keys(priceData).length > 0 ? priceData : null;
  }

  /**
   * Identify property owner
   */
  identifyOwner(messages, text) {
    let ownerData = {
      name: null,
      phone: null,
      whatsappNumber: null,
      ownershipType: 'uncertain'
    };

    if (messages && messages.length > 0) {
      const firstMessage = messages[0];
      if (firstMessage.senderName) {
        ownerData.name = firstMessage.senderName;
      }
      if (firstMessage.senderPhone) {
        ownerData.whatsappNumber = firstMessage.senderPhone;
      }
    }

    const phonePattern = /(\+?971\d{9}|0\d{9})/g;
    const phoneMatch = phonePattern.exec(text);
    if (phoneMatch && !ownerData.phone) {
      ownerData.whatsappNumber = phoneMatch[1];
    }

    if (this.hasKeywords(text, this.keywords.ownershipIndicators.owner)) {
      ownerData.ownershipType = 'direct_owner';
    } else if (this.hasKeywords(text, this.keywords.ownershipIndicators.propertyManager)) {
      ownerData.ownershipType = 'property_manager';
    } else if (this.hasKeywords(text, this.keywords.ownershipIndicators.broker)) {
      ownerData.ownershipType = 'broker';
    }

    return ownerData.name || ownerData.phone ? ownerData : null;
  }

  /**
   * Extract furnishing level
   */
  extractFurnishing(text) {
    if (this.hasKeywords(text, this.keywords.furnishingIndicators.furnished)) {
      return 'furnished';
    }
    if (this.hasKeywords(text, this.keywords.furnishingIndicators.semiFurnished)) {
      return 'semi_furnished';
    }
    if (this.hasKeywords(text, this.keywords.furnishingIndicators.unfurnished)) {
      return 'unfurnished';
    }
    return null;
  }

  /**
   * Extract property features
   */
  extractFeatures(text) {
    const features = [];
    for (const feature of this.keywords.featureKeywords) {
      if (text.includes(feature.toLowerCase())) {
        features.push(feature);
      }
    }
    return features;
  }

  /**
   * Extract named entities
   */
  extractEntities(messages) {
    const entities = [];

    const phonePattern = /(\+?971\d{9}|0\d{9})/g;
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

    for (const message of messages) {
      const content = message.content || message.text;

      const phones = content.match(phonePattern);
      if (phones) {
        phones.forEach(phone => {
          if (!entities.find(e => e.type === 'phone' && e.value === phone)) {
            entities.push({ type: 'phone', value: phone });
          }
        });
      }

      const emails = content.match(emailPattern);
      if (emails) {
        emails.forEach(email => {
          if (!entities.find(e => e.type === 'email' && e.value === email)) {
            entities.push({ type: 'email', value: email });
          }
        });
      }
    }

    return entities;
  }

  /**
   * Generate auto-reply suggestions
   */
  generateAutoReply(analysis) {
    if (analysis.overallConfidence < 60) {
      return {
        shouldAutoReply: true,
        replyType: 'clarification',
        template: 'clarification_needed',
        message: 'Thanks for reaching out! To help you better, could you please share:\n1. Exact location of the property\n2. Monthly rent or asking price\n3. Number of bedrooms\n4. Furnishing level'
      };
    }

    if (analysis.overallConfidence >= 80 && analysis.properties.length > 0) {
      const prop = analysis.properties[0];
      let message = `Thanks for sharing! I'm interested in your ${prop.type}`;
      if (prop.extractedData.location) {
        message += ` in ${prop.extractedData.location}`;
      }
      message += '. Could you please send us:\n1. Photos of the property\n2. Available from date\n3. Lease terms';

      return {
        shouldAutoReply: true,
        replyType: 'confirmation',
        template: 'details_request',
        message
      };
    }

    return {
      shouldAutoReply: false,
      replyType: null,
      message: null
    };
  }

  /**
   * Generate quick-reply suggestions
   */
  generateQuickReplies(analysis) {
    const quickReplies = [];

    quickReplies.push({
      text: 'Can you send photos?',
      priority: 'high'
    });

    quickReplies.push({
      text: 'What\'s the asking price?',
      priority: 'high'
    });

    if (analysis.properties.length > 0) {
      const prop = analysis.properties[0];

      if (!prop.extractedData.price) {
        quickReplies.push({
          text: 'Monthly rent: _____ AED',
          priority: 'high'
        });
      }

      if (!prop.extractedData.size) {
        quickReplies.push({
          text: 'How many bedrooms?',
          priority: 'medium'
        });
      }

      if (!prop.extractedData.furnishing) {
        quickReplies.push({
          text: 'Is it furnished?',
          priority: 'medium'
        });
      }
    }

    quickReplies.push({
      text: 'Great! Let\'s schedule a viewing',
      priority: 'medium'
    });

    return quickReplies;
  }
}

export default new ConversationAnalyzer();
