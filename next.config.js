/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages as a project site (https://<user>.github.io/<repo>/),
// the site is served from a sub-path, so we need basePath/assetPrefix set to the repo name.
// The workflow sets NEXT_PUBLIC_BASE_PATH automatically from the repository name.
// If you deploy elsewhere (Vercel, a custom domain, a user/organization page at the
// root path, etc.), leave NEXT_PUBLIC_BASE_PATH unset and this falls back to "".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
