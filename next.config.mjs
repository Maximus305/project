/** @type {import('next').NextConfig} */
export default {
    async rewrites() {
      return [
        {
          source: '/api/upload',
          destination: 'https://pdf2llm-d4y3d99yh-maximus305s-projects.vercel.app/api/upload',
        },
      ];
    },
  };