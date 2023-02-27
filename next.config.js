module.exports = {
  env: {
    UNLOCK_KEY: process.env.UNLOCK_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: [''],
  },
  distDir: 'build',
  images: {
    domains: ['ipfs.infura.io', 'firebasestorage.googleapis.com', 'ipfs.infura.io', 'countryflagsapi.com', 'randomuser.me', 'images.unsplash.com', 'media.istockphoto.com', 'storage.googleapis.com', 'images.ctfassets.net'],
  },
  reactStrictMode: false,
  swcMinify: false,

};
