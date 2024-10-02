const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const pages = [
  { name: "index", template: "./src/index.html" },
  { name: "about-us", template: "./src/about-us.html" },
  { name: "services", template: "./src/services.html" },
  { name: "get-in-touch", template: "./src/get-in-touch.html" },
  { name: "contact-us", template: "./src/contact-us.html" },
  { name: "faq", template: "./src/faq.html" },
  { name: "coming-soon", template: "./src/coming-soon.html" },
  { name: "info-adjacent", template: "./src/info-adjacent.html" },
  { name: "property-slider", template: "./src/property-slider.html" },
  { name: "project-complex", template: "./src/project-complex.html" },
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
        commonHead: fs.readFileSync(
          path.resolve(__dirname, "src", "components", "common-head.html"),
          "utf-8"
        ),
      },
      navbar: fs.readFileSync("./src/components/navbar.html", "utf8"),
      footer: fs.readFileSync("./src/components/footer.html", "utf8"),
      bottom: fs.readFileSync("./src/components/bottom-toolbar.html", "utf8"),
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
    watchFiles: ["src/**/*.html"],
    hot: true,
    port: 8080,
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
