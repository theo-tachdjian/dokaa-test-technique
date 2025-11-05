
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'co-restaurants.roocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'co-restaurants.roocdn',
      },
      {
        protocol: 'https',
        hostname: '*.roocdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.roocdn',
      },
      {
        protocol: 'https',
        hostname: 'deliveroo.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.deliveroo.fr',
      },
    ],
  },
}

module.exports = nextConfig

