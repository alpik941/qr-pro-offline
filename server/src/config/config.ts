import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

function validateConfig(): Config {
  const port = parseInt(process.env.PORT || '3001', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('Invalid PORT: must be a number between 1 and 65535');
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error('Invalid NODE_ENV: must be development, production, or test');
  }

  // CORS origins - strict in production
  let corsOrigins: string[];
  if (nodeEnv === 'production') {
    const origins = process.env.CORS_ORIGINS;
    if (!origins) {
      throw new Error('CORS_ORIGINS must be set in production');
    }
    corsOrigins = origins.split(',').map(origin => origin.trim());
  } else {
    corsOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  }

  const rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);

  return {
    port,
    nodeEnv,
    corsOrigins,
    rateLimit: {
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
    },
  };
}

export const config = validateConfig();