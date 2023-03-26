const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: false
  },
  webpack: {
    resolve: {
      alias: {
        core: path.join(__dirname, 'core'),
      },
    },
  }
  // webpack: (config, { nextRuntime }) => {
  //   // Undocumented property of next 12.
  //   if (nextRuntime !== "nodejs") return config;
  //   return {
  //     ...config,
  //   }
  // },
}

module.exports = nextConfig
