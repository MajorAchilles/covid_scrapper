const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 443,
  PORT_UNSECURED: process.env.PORT_UNSECURED ? parseInt(process.env.PORT_UNSECURED) : 80,
  CACHE_TTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 1000 * 60 * 60,
  DEV: !!process.env.DEV,
};

module.exports = config;