/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/db",
    "@workspace/api",
    "@workspace/auth",
    "@workspace/schema",
    "@workspace/utils",
  ],
  serverExternalPackages: [],
  output: "standalone",
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
