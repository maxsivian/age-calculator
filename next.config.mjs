/** @type {import('next').NextConfig} */
const nextConfig = {
    // Static HTML export — required so Capacitor can load the app from the `out` folder
    output: 'export',
    trailingSlash: true,
    // next/image optimization needs a server; disable it for static / Capacitor builds
    images: {
        unoptimized: true,
    },
    // basePath: '/age-calculator',
    // assetPrefix: './',
};

export default nextConfig;
