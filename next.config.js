/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["lh3.googleusercontent.com"],
        unoptimized: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: "standalone",
};

module.exports = nextConfig;
