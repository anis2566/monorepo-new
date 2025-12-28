/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/db",
    "@workspace/api",
    "@workspace/auth",
  ],
  serverExternalPackages: [],
  output: "standalone",
};

export default nextConfig;
