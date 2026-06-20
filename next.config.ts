import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    if (process.env.APP_NAME !== "coachkudos") return [];
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
