export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  integrations: string[];
  devops: string[];
  uiPatterns: string[];
}

export interface SystemComponentMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  uptime: number;
}

export interface SystemComponent {
  id: string;
  name: string;
  type: string;
  status: string;
  metrics: SystemComponentMetrics;
}

export const TECH_STACK: TechStack = {
  frontend: ['React 18', 'Redux Toolkit', 'Vite 7.3', 'React Router v6', 'Framer Motion', 'Lucide Icons', 'CSS Modules'],
  backend: ['Express.js', 'Node.js 20', 'Mongoose ODM', 'JWT Auth', 'RESTful API'],
  database: ['MongoDB Atlas', 'Firebase Auth', 'PostgreSQL (Neon)'],
  integrations: ['Stripe', 'WhatsApp Business API', 'Google Calendar', 'Google Drive', 'Google Maps', 'Vercel Speed Insights', 'GitHub API'],
  devops: ['Replit', 'Nix', 'Git', 'ESLint', 'Vitest'],
  uiPatterns: ['Sidebar Navigation (280px/72px)', 'Dark/Light Theme', 'Responsive Breakpoints (1024px/768px)', 'Lazy Loading', 'Code Splitting']
};

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    id: 'damac_crm_api',
    name: 'DAMAC CRM API',
    type: 'api',
    status: 'healthy',
    metrics: { cpu: 45, memory: 62, responseTime: 128, uptime: 99.98 }
  },
  {
    id: 'mongodb_cluster',
    name: 'MongoDB Cluster',
    type: 'database',
    status: 'healthy',
    metrics: { cpu: 32, memory: 78, responseTime: 45, uptime: 99.99 }
  },
  {
    id: 'react_frontend',
    name: 'React Frontend',
    type: 'frontend',
    status: 'healthy',
    metrics: { cpu: 15, memory: 41, responseTime: 210, uptime: 99.95 }
  },
  {
    id: 'express_backend',
    name: 'Express Backend',
    type: 'backend',
    status: 'healthy',
    metrics: { cpu: 38, memory: 55, responseTime: 89, uptime: 99.97 }
  },
  {
    id: 'redis_cache',
    name: 'Redis Cache',
    type: 'cache',
    status: 'healthy',
    metrics: { cpu: 12, memory: 34, responseTime: 5, uptime: 99.99 }
  }
];
