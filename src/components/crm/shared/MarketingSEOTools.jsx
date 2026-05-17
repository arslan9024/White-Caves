import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, Globe, FileText, BarChart3,
  Target, Sparkles, CheckCircle, AlertCircle, Loader,
  ExternalLink, Copy, RefreshCw
} from 'lucide-react';
import './MarketingSEOTools.css';

const KEYWORD_SUGGESTIONS = [
  { keyword: 'dubai villa for sale', volume: 12500, difficulty: 72, cpc: 'AED 8.50' },
  { keyword: 'apartment dubai marina', volume: 9800, difficulty: 68, cpc: 'AED 7.20' },
  { keyword: 'off plan dubai 2026', volume: 8200, difficulty: 45, cpc: 'AED 5.80' },
  { keyword: 'luxury penthouse palm jumeirah', volume: 3400, difficulty: 55, cpc: 'AED 12.00' },
  { keyword: 'rent apartment jvc', volume: 6700, difficulty: 52, cpc: 'AED 4.50' },
  { keyword: 'damac hills villa', volume: 4500, difficulty: 48, cpc: 'AED 6.30' },
  { keyword: 'downtown dubai property', volume: 7800, difficulty: 65, cpc: 'AED 9.20' },
  { keyword: 'emirates hills mansion', volume: 1200, difficulty: 38, cpc: 'AED 15.00' }
];

const SEO_CHECKLIST = [
  { id: 'title', label: 'Meta Title (50-60 chars)', status: 'pass', value: 'Luxury Villas for Sale in Dubai | White Caves Real Estate' },
  { id: 'description', label: 'Meta Description (150-160 chars)', status: 'pass', value: 'Discover luxury properties in Dubai...' },
  { id: 'h1', label: 'H1 Heading', status: 'pass', value: 'Dubai Luxury Real Estate' },
  { id: 'images', label: 'Image Alt Tags', status: 'warning', value: '85% optimized' },
  { id: 'speed', label: 'Page Speed Score', status: 'pass', value: '92/100' },
  { id: 'mobile', label: 'Mobile Friendly', status: 'pass', value: 'Responsive' },
  { id: 'ssl', label: 'SSL Certificate', status: 'pass', value: 'Active' },
  { id: 'sitemap', label: 'XML Sitemap', status: 'pass', value: 'Submitted' }
];

const CONTENT_IDEAS = [
  { title: 'Top 10 Off-Plan Projects in Dubai 2026', type: 'Blog Post', score: 92, keywords: ['off plan dubai', 'new projects 2026'] },
  { title: 'Complete Guide to Buying Property in Dubai for Expats', type: 'Guide', score: 88, keywords: ['buy property dubai', 'expat guide'] },
  { title: 'Dubai Marina vs JVC: Which is Better for Investment?', type: 'Comparison', score: 85, keywords: ['dubai marina investment', 'jvc property'] },
  { title: 'How Ejari Registration Works in Dubai', type: 'How-To', score: 78, keywords: ['ejari registration', 'dubai rental'] }
];

export default function MarketingSEOTools({ compact = false }) {
  const [activeTab, setActiveTab] = useState('keywords');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 40) return '#10b981';
    if (difficulty < 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle size={16} className="status-pass" />;
      case 'warning': return <AlertCircle size={16} className="status-warning" />;
      case 'fail': return <AlertCircle size={16} className="status-fail" />;
      default: return null;
    }
  };

  if (compact) {
    return (
      <div className="seo-tools-compact">
        <div className="compact-header">
          <Globe size={20} />
          <span>SEO Score: <strong>92/100</strong></span>
        </div>
        <div className="compact-keywords">
          <span>Top Keywords:</span>
          {KEYWORD_SUGGESTIONS.slice(0, 3).map(kw => (
            <span key={kw.keyword} className="keyword-tag">{kw.keyword}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="marketing-seo-tools">
      <div className="tools-header">
        <div className="header-title">
          <Globe size={24} />
          <div>
            <h3>Digital Marketing & SEO Tools</h3>
            <p>Optimize your property listings for search engines</p>
          </div>
        </div>
        <div className="header-score">
          <div className="score-circle">
            <span className="score-value">92</span>
            <span className="score-label">SEO Score</span>
          </div>
        </div>
      </div>

      <div className="tools-tabs">
        {['keywords', 'seo_audit', 'content', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tool-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'keywords' && <Search size={16} />}
            {tab === 'seo_audit' && <Target size={16} />}
            {tab === 'content' && <FileText size={16} />}
            {tab === 'analytics' && <BarChart3 size={16} />}
            {tab.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="tools-content">
        {activeTab === 'keywords' && (
          <div className="keywords-section">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Enter a keyword to research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? <Loader size={16} className="spin" /> : <Sparkles size={16} />}
                Analyze
              </button>
            </div>
            
            <div className="keywords-table">
              <div className="table-header">
                <span>Keyword</span>
                <span>Monthly Volume</span>
                <span>Difficulty</span>
                <span>Est. CPC</span>
                <span>Actions</span>
              </div>
              {KEYWORD_SUGGESTIONS.map((kw, index) => (
                <motion.div 
                  key={kw.keyword}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="keyword-name">{kw.keyword}</span>
                  <span className="volume">{kw.volume.toLocaleString()}</span>
                  <span className="difficulty">
                    <div className="difficulty-bar">
                      <div 
                        className="difficulty-fill" 
                        style={{ 
                          width: `${kw.difficulty}%`,
                          background: getDifficultyColor(kw.difficulty)
                        }}
                      />
                    </div>
                    <span>{kw.difficulty}</span>
                  </span>
                  <span className="cpc">{kw.cpc}</span>
                  <span className="actions">
                    <button className="icon-btn" title="Copy"><Copy size={14} /></button>
                    <button className="icon-btn" title="Add to tracking"><Target size={14} /></button>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo_audit' && (
          <div className="seo-audit-section">
            <div className="audit-header">
              <h4>On-Page SEO Audit</h4>
              <button onClick={handleAnalyze}>
                <RefreshCw size={16} /> Re-analyze
              </button>
            </div>
            <div className="checklist">
              {SEO_CHECKLIST.map(item => (
                <div key={item.id} className={`checklist-item ${item.status}`}>
                  {getStatusIcon(item.status)}
                  <div className="item-content">
                    <span className="item-label">{item.label}</span>
                    <span className="item-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-section">
            <div className="content-header">
              <h4>AI Content Suggestions</h4>
              <button>
                <Sparkles size={16} /> Generate Ideas
              </button>
            </div>
            <div className="content-ideas">
              {CONTENT_IDEAS.map((idea, index) => (
                <motion.div 
                  key={idea.title}
                  className="idea-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="idea-header">
                    <span className="idea-type">{idea.type}</span>
                    <span className="idea-score">Score: {idea.score}</span>
                  </div>
                  <h5>{idea.title}</h5>
                  <div className="idea-keywords">
                    {idea.keywords.map(kw => (
                      <span key={kw} className="keyword-tag">{kw}</span>
                    ))}
                  </div>
                  <button className="create-btn">
                    <FileText size={14} /> Create Content
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="metric-card">
                <TrendingUp size={24} />
                <div className="metric-content">
                  <span className="metric-value">24,580</span>
                  <span className="metric-label">Organic Visitors (30d)</span>
                </div>
                <span className="metric-change positive">+12%</span>
              </div>
              <div className="metric-card">
                <Search size={24} />
                <div className="metric-content">
                  <span className="metric-value">156</span>
                  <span className="metric-label">Keywords Ranking</span>
                </div>
                <span className="metric-change positive">+8</span>
              </div>
              <div className="metric-card">
                <Target size={24} />
                <div className="metric-content">
                  <span className="metric-value">3.2%</span>
                  <span className="metric-label">Conversion Rate</span>
                </div>
                <span className="metric-change positive">+0.5%</span>
              </div>
              <div className="metric-card">
                <Globe size={24} />
                <div className="metric-content">
                  <span className="metric-value">45</span>
                  <span className="metric-label">Backlinks</span>
                </div>
                <span className="metric-change positive">+3</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
