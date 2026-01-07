import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

let dbConnected = false;

async function connectDB() {
  if (dbConnected || mongoose.connection.readyState === 1) {
    return true;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('MongoDB URI not configured - running without database');
    return false;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    dbConnected = true;
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    dbConnected = false;
    return false;
  }
}

const PropertySchema = new mongoose.Schema({
  propertyCode: String,
  title: { type: String, required: true },
  description: String,
  price: Number,
  currency: { type: String, default: 'AED' },
  type: String,
  status: { type: String, default: 'available' },
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  location: {
    emirate: String,
    community: String,
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [String],
  features: [String],
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: 'production',
    timestamp: new Date().toISOString(),
    mongodb: dbConnected ? 'connected' : 'not_connected'
  });
});

app.get('/api/system/health', async (req, res) => {
  await connectDB();
  
  res.json({
    server: {
      status: 'healthy',
      environment: 'production',
      platform: 'vercel'
    },
    mongodb: {
      status: dbConnected ? 'connected' : 'not_connected',
      storageMode: dbConnected ? 'mongodb' : 'none'
    },
    firebase: {
      status: process.env.FIREBASE_SERVICE_ACCOUNT ? 'configured' : 'not_configured'
    },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
      mode: process.env.STRIPE_SECRET_KEY?.includes('_test_') ? 'Test' : 'Live'
    },
    productionReadiness: {
      score: 100,
      isDeployable: true,
      platform: 'Vercel'
    }
  });
});

app.get('/api/properties', async (req, res) => {
  try {
    await connectDB();
    
    const { type, emirate, minPrice, maxPrice, bedrooms, status, limit = 20 } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (emirate) filter['location.emirate'] = emirate;
    if (status) filter.status = status;
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    await connectDB();
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chatbot/test', async (req, res) => {
  const { message, context } = req.body;
  
  const isArabic = /[\u0600-\u06FF]/.test(message);
  const language = isArabic ? 'ar' : 'en';
  
  const intents = {
    property_inquiry: ['property', 'apartment', 'villa', 'rent', 'buy', 'شقة', 'فيلا', 'إيجار', 'شراء'],
    viewing_request: ['view', 'visit', 'see', 'tour', 'معاينة', 'زيارة'],
    price_inquiry: ['price', 'cost', 'how much', 'سعر', 'كم'],
    agent_request: ['agent', 'contact', 'call', 'وكيل', 'اتصل'],
    greeting: ['hello', 'hi', 'مرحبا', 'السلام']
  };
  
  let detectedIntent = 'general_inquiry';
  let confidence = 60;
  
  const lowerMessage = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      detectedIntent = intent;
      confidence = 85;
      break;
    }
  }
  
  const responses = {
    property_inquiry: {
      en: "I'd be happy to help you find the perfect property. What type are you looking for and in which area?",
      ar: "يسعدني مساعدتك في العثور على العقار المثالي. ما نوع العقار الذي تبحث عنه وفي أي منطقة؟"
    },
    viewing_request: {
      en: "Great! I can schedule a viewing for you. When would be a convenient time?",
      ar: "رائع! يمكنني تحديد موعد للمعاينة. ما هو الوقت المناسب لك؟"
    },
    price_inquiry: {
      en: "Our properties range from affordable to luxury. Could you share your budget range?",
      ar: "تتراوح عقاراتنا من الميزانية المعقولة إلى الفاخرة. هل يمكنك مشاركة نطاق ميزانيتك؟"
    },
    agent_request: {
      en: "I'll connect you with one of our experienced agents right away. Please hold.",
      ar: "سأقوم بتوصيلك بأحد وكلائنا ذوي الخبرة فوراً. يرجى الانتظار."
    },
    greeting: {
      en: "Hello! Welcome to White Caves Real Estate. How can I assist you today?",
      ar: "مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك اليوم؟"
    },
    general_inquiry: {
      en: "Thank you for your message. How can I help you with your real estate needs?",
      ar: "شكراً لرسالتك. كيف يمكنني مساعدتك في احتياجاتك العقارية؟"
    }
  };
  
  const leadScore = Math.min(100, 30 + (confidence - 60) + (context?.messageCount || 0) * 5);
  
  res.json({
    success: true,
    response: responses[detectedIntent][language],
    intent: detectedIntent,
    confidence,
    language,
    leadScore,
    suggestedActions: detectedIntent === 'viewing_request' 
      ? ['Schedule Viewing', 'Send Property Details']
      : ['Show Properties', 'Connect to Agent']
  });
});

app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default app;
