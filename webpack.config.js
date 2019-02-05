const path = require("path");
const webpack = require("webpack");
const ClosurePlugin = require("closure-webpack-plugin");
// const ClosureCompiler = require("google-closure-compiler-js").webpack;

module.exports = {
  entry: {
    annotorious: "./src/annotorious.js"
  },
  devtool: "cheap-source-map",
  output: {
    path: path.resolve(__dirname, "dist2"),
    filename: "[name].js"
  },
  plugins: [
    new ClosurePlugin(
      {
        mode: "NONE", //'AGGRESSIVE_BUNDLE',
        closureLibraryBase: require.resolve(
          "google-closure-library/closure/goog/base"
        ),
        deps: [
          require.resolve("google-closure-library/closure/goog/deps"),
          "./dist/deps.js"
        ]
      },
      {
        define: {
          "goog.global.CLOSURE_NO_DEPS": true
        },
        language_out: "ECMASCRIPT5",
        formatting: "PRETTY_PRINT"
      }
    )
  ]
};
