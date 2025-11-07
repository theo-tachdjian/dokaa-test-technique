
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rs-menus-api.roocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'co-restaurants.roocdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.roocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'deliveroo.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.deliveroo.fr',
      },
      {
        protocol: 'https',
        hostname: 'images.deliveroo.fr',
      },
      {
        protocol: 'https',
        hostname: '*.deliveroo.fr',
      },
    ],
  },
}

module.exports = nextConfig
