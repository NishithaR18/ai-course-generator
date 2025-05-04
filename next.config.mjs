/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'firebasestorage.googleapis.com', // For Firebase images
        'your-storage-bucket.com' ,
        'img.clerk.com'        // Add other domains as needed
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.googleapis.com',
        },
      ],
    },
  };
  
  export default nextConfig;