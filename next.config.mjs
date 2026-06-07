/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Legacy campaign URLs redirect to refer
      {
        source: '/campaigns/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/campaign/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/bounty/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/bounties/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      // NEW: Offer URL variations
      {
        source: '/offer/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/offers/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/o/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/r/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/job/:id',
        destination: '/refer/:id',
        permanent: false,
      },
      {
        source: '/jobs/:id',
        destination: '/refer/:id',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
