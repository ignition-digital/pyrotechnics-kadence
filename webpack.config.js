const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Define your 'roots' variable
const ROOTS_URL = "https://www.pyrotechnicsfireworks.com";

// Define the pages for HtmlWebpackPlugin
const pages = [
  { name: "index", template: "./src/index.html" },
  { name: "about-us", template: "./src/about-us.html" },
  { name: "contact-us", template: "./src/contact-us.html" },
  { name: "product", template: "./src/product.html" },
  { name: "our-fireworks", template: "./src/our-fireworks.html" },
  { name: "404", template: "./src/404.html" },
];

const htmlPlugins = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      filename: `${page.name}.html`,
      template: page.template,
      minify: {
        removeOptionalTags: false,
        collapseWhitespace: true,
      },
      inject: "head",
      templateParameters: {
        commonHead: fs
          .readFileSync(
            path.resolve(__dirname, "src", "components", "common-head.html"),
            "utf-8"
          )
          .replace(/<%= roots %>/g, ROOTS_URL),
        roots: ROOTS_URL,
      },
      navbar: fs
        .readFileSync("./src/components/navbar.html", "utf8")
        .replace(/<%= roots %>/g, ROOTS_URL),
      footer: fs
        .readFileSync("./src/components/footer.html", "utf8")
        .replace(/<%= roots %>/g, ROOTS_URL),
    })
);

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "production",
  performance: {
    maxAssetSize: 2512000,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    watchFiles: ["src/**/*.html", "src/**/*.js", "src/**/*.css"],
    hot: true,
    port: 8080,
    open: true,
  },
  plugins: [
    ...htmlPlugins,
    new CopyWebpackPlugin({
      patterns: [
        { from: "wp-includes", to: "wp-includes" },
        { from: "wp-content", to: "wp-content" },
        { from: "i18n", to: "i18n" },
        { from: "data", to: "data" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/service-worker.js", to: "service-worker.js" },
        {
          from: path.resolve(__dirname, "CNAME"),
          to: path.resolve(__dirname, "dist"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
