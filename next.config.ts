import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    try {
      const inngestRoot = require.resolve("inngest");
      config.resolve.alias = {
        ...config.resolve.alias,
        "inngest/components/InngestFunction$": inngestRoot.replace(
          /index\.(js|cjs)$/,
          "components/InngestFunction.js",
        ),
        "inngest/helpers/errors$": inngestRoot.replace(
          /index\.(js|cjs)$/,
          "helpers/errors.js",
        ),
      };
    } catch (e) {
      console.error(e);
    }
    return config;
  },
};

export default nextConfig;
