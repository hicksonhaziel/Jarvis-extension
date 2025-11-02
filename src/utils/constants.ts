// API Configuration
export const API_BASE_URL = 'https://jarvis-backend-test-1.onrender.com'; 
export const WEB_API_BASE_URL = 'https://jarvis-web1.vercel.app';


// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/',
  
  // Authentication
  AUTH: {
    SESSION: '/auth/session',
    REFRESH: '/auth/refresh',
    VALIDATE: '/auth/validate',
  },
  
  // Voice Commands
  VOICE: {
    COMMAND: '/voice/command',
  },
  
  // Deployments
  DEPLOYMENTS: '/deployments',
  DEPLOYMENT_STATUS: (id: string) => `/deployments/${id}/status`,
  DEPLOYMENT_DELETE: (id: string) => `/deployments/${id}`,
  
  // Providers
  PROVIDERS: '/providers', 
  
  // Pricing
  PRICING: {
    ESTIMATE: '/pricing/estimate',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'jarvis_token',
  WALLET_ADDRESS: 'jarvis_wallet_address',
  TOKEN_EXPIRES: 'jarvis_token_expires',
  THEME: 'jarvis_theme',
  WALLET: 'jarvis_wallet',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  PAYLOAD_TOO_LARGE: 413,
} as const;

// Default Values
export const DEFAULTS = {
  PER_PAGE: 10,
  PAGE: 1,
  PAYMENT_CURRENCY: 'USD',
} as const;

// File Limits
export const FILE_LIMITS = {
  AUDIO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  AUDIO_MAX_DURATION: 30, // 30 seconds
  SUPPORTED_AUDIO_FORMATS: ['audio/wav', 'audio/mp3', 'audio/mpeg'],
} as const;