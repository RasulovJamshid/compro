/** @type {import('next').NextConfig} */
const deploymentEnv = process.env.DEPLOYMENT_ENV || 'local';
const domain = process.env.DOMAIN || 'localhost';

// Dynamic API URL based on deployment environment
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (deploymentEnv === 'remote') {
    return `https://api.${domain}`;
  }
  
  return 'http://localhost:3001';
};

const nextConfig = {
  images: {
    domains: [
      'localhost',
      domain,
      `api.${domain}`,
      `www.${domain}`,
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: getApiUrl(),
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    DEPLOYMENT_ENV: deploymentEnv,
    DOMAIN: domain,
  },
  // Production optimizations
  ...(deploymentEnv === 'remote' && {
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
  }),
}

module.exports = nextConfig
