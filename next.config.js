/** @type {import('next').NextConfig} */

// output: "export" produces a static ./out folder that GitHub Pages can serve.
//
// basePath/assetPrefix are intentionally left out here: the deploy workflow uses
// actions/configure-pages with `static_site_generator: next`, which injects the
// correct basePath (and images.unoptimized) into this file automatically at build
// time, based on whether this repo is a project site (served from /<repo-name>/)
// or a user/organization site (served from /). If you deploy elsewhere (Vercel, a
// custom domain, your own server) and aren't using that action, set basePath here
// yourself instead.
const nextConfig = {
  output: "export",
};

module.exports = nextConfig;
