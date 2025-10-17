/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: { formats: ['image/avif','image/webp'] },
    experimental: {
        optimizePackageImports: ['@mui/material','@mui/icons-material','@mui/lab','@mui/system'],
    },
};
export default nextConfig;
