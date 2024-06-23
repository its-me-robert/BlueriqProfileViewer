/** @type {import('next').NextConfig} */
const nextConfig = {
    // Conditionally set the basePath based on the NODE_ENV environment variable
    basePath: process.env.NODE_ENV === 'production' ? '/BlueriqProfileViewer' : '',
    reactStrictMode: true,
}

export default nextConfig;