/** @type {import('next').NextConfig} */
const nextConfig = {
  // MENGHAPUS: output: 'export'
  
  // Mengizinkan Next.js memproses gambar dari domain eksternal jika diperlukan nanti
  images: {
    remotePatterns: [],
  },

  // Menyembunyikan peringatan turbopack/caching yang tidak relevan
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;