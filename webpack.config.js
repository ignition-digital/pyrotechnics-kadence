const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Define your 'roots' variable
//const ROOTS_URL = "";
const ROOTS_URL = "https://ignition-digital.github.io/goldeneraworld";

const pages = [
  { name: "index", template: "./src/index.html" },
  { name: "about-us", template: "./src/about-us.html" },
  { name: "services", template: "./src/services.html" },
  { name: "get-in-touch", template: "./src/get-in-touch.html" },
  { name: "contact-us", template: "./src/contact-us.html" },
  { name: "faq", template: "./src/faq.html" },
  { name: "coming-soon", template: "./src/coming-soon.html" },
  { name: "404", template: "./src/404.html" },
  { name: "info-adjacent", template: "./src/info-adjacent.html" },
  { name: "property-slider", template: "./src/property-slider.html" },
  { name: "project-complex", template: "./src/project-complex.html" },
  { name: "apartment-single", template: "./src/apartment-single.html" },
  { name: "feature-bellow", template: "./src/feature-bellow.html" },
  { name: "info-bellow", template: "./src/info-bellow.html" },
  { name: "landing", template: "./src/landing.html" },
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
        // Add roots to template parameters
        roots: ROOTS_URL,
      },
      navbar: fs
        .readFileSync("./src/components/navbar.html", "utf8")
        .replace(/<%= roots %>/g, ROOTS_URL),
      footer: fs
        .readFileSync("./src/components/footer.html", "utf8")
        .replace(/<%= roots %>/g, ROOTS_URL),
      bottom: fs
        .readFileSync("./src/components/bottom-toolbar.html", "utf8")
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
  mode: "development",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    watchFiles: ["src/**/*.html", "src/**/*.js", "src/**/*.css"],
    hot: true,
    port: 8080,
    open: true, // Opens the browser automatically
  },
  plugins: [
    ...htmlPlugins,
    new CopyWebpackPlugin({
      patterns: [
        { from: "wp-includes", to: "wp-includes" },
        { from: "wp-content", to: "wp-content" },
        { from: "wp-admin", to: "wp-admin" },
        { from: "wp-json", to: "wp-json" },
      ],
    }),
  ],
};
