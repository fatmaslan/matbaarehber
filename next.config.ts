import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iyroenyrfucvhagbldfk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
   domains: ['via.placeholder.com', 'example.com']
  },
};

export default nextConfig;
