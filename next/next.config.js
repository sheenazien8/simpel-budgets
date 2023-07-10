/** @type {import('next').NextConfig} */
require('dotenv').config();
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});


const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  },

};

module.exports = withPWA(nextConfig);
