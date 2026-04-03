import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "schuur.b-cdn.net" },
      { protocol: "https", hostname: "media.ssphaarlem.nl" },
      { protocol: "https", hostname: "patronaat.nl" },
      { protocol: "https", hostname: "haarlem.nl" },
      { protocol: "https", hostname: "www.haarlem.nl" },
      { protocol: "https", hostname: "www.visithaarlem.com" },
      { protocol: "https", hostname: "www.kidsproof.nl" },
    ],
  },
};

export default nextConfig;
