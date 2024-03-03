/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = require('./csp')
const redirects = require('./redirects')

// next.config.js
const path = require('path')
const { withPayload } = require('@payloadcms/next-payload')

module.exports = withPayload(
  {
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: [
        'localhost',
        'https://teckinfinityecomm.payloadcms.app/',
        `${process.env.NEXT_PUBLIC_SERVER_URL} /media`,
      ]
        .filter(Boolean)
        .map(url => url.replace(/https?:\/\//, '')),
    },
    redirects,
    async headers() {
      const headers = []

      // Prevent search engines from indexing the site if it is not live
      // This is useful for staging environments before they are ready to go live
      // To allow robots to crawl the site, use the `NEXT_PUBLIC_IS_LIVE` env variable
      // You may want to also use this variable to conditionally render any tracking scripts
      if (!process.env.NEXT_PUBLIC_IS_LIVE) {
        headers.push({
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
          source: '/:path*',
        })
      }

      // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
      // It works by explicitly whitelisting trusted sources of content for your website
      // This will block all inline scripts and styles except for those that are allowed
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      })

      return headers
    },
  },
  {
    // The second argument to `withPayload`
    // allows you to specify paths to your Payload dependencies
    // and configure the admin route to your Payload CMS.

    // Point to your Payload config (required)
    configPath: path.resolve(__dirname, './src/payload/payload.config.ts'),

    // Point to custom Payload CSS (optional)
    cssPath: path.resolve(__dirname, './src/app/_css/app.scss'),

    // Point to your exported, initialized Payload instance (optional, default shown below`)
    payloadPath: path.resolve(process.cwd(), './src/payload/payloadClient.ts'),

    // Set a custom Payload admin route (optional, default is `/admin`)
    // NOTE: Read the "Set a custom admin route" section in the payload/next-payload README.
    adminRoute: '/admin',
  },
)