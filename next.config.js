/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimizer is used by /api/slider-images to serve resized card
  // variants to the MFL league homepages (no next/image components in-app).

  async headers() {
    return [
      {
        // Custom JS/CSS embedded on the MFL sites is versioned via ?v= query
        // params, so it can be cached hard. Vercel's default for /public
        // assets (max-age=0, must-revalidate) forced a revalidation
        // round-trip on every MFL page view. One day + SWR keeps hotfixes
        // possible even if a ?v= bump is forgotten.
        source: '/js/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
