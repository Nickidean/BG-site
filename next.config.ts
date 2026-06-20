import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    if (process.env.SITE_ID !== "coachkudos") return [];
    return [
      {
        source: "/",
        destination: "/kudos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
