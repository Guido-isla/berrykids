import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
      { protocol: "https", hostname: "speeltuindeeenhoorn.nl" },
      { protocol: "https", hostname: "sportfondsen-website-prd-media.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "playgroundhaarlem.nl" },
      { protocol: "https", hostname: "speeltuinramplaan.wordpress.com" },
      { protocol: "https", hostname: "b3884015.smushcdn.com" },
      { protocol: "https", hostname: "www.archeologischmuseumhaarlem.nl" },
      { protocol: "https", hostname: "www.ballorig.nl" },
      { protocol: "https", hostname: "b1307353.smushcdn.com" },
      { protocol: "https", hostname: "www.linnaeushof.nl" },
      { protocol: "https", hostname: "www.artisklas-haarlem.nl" },
      { protocol: "https", hostname: "www.hertenkampbloemendaal.nl" },
      { protocol: "https", hostname: "museumvandegeest.nl" },
      { protocol: "https", hostname: "draaiorgelmuseum.org" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "www.pietervermeulenmuseum.nl" },
      { protocol: "https", hostname: "haarlem.letsescape.nl" },
      { protocol: "https", hostname: "www.pannenkoekenparadijs.nl" },
    ],
  },
};

export default withNextIntl(nextConfig);
