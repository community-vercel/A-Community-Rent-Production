/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["jxttsugezpnysmpnbxmj.supabase.co", "community-hazel.vercel.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;
