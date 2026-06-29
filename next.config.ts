import type { NextConfig } from "next";

import { redirectRules } from "./lib/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return redirectRules;
  },
};

export default nextConfig;
