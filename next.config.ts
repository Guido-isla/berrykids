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
      { protocol: "https", hostname: "d1asnx830aw7pt.cloudfront.net" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "www.stayokay.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.buitenplaatselswout.nl" },
      { protocol: "https", hostname: "us.images.westend61.de" },
      { protocol: "https", hostname: "www.spaarnwoudepark.nl" },
      { protocol: "https", hostname: "streetjump.nl" },
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
  },
};

export default nextConfig;
