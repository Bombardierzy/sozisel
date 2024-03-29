/* eslint-disable */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')


const DEV = process.env.NODE_ENV !== "production";

module.exports = {
  // change me once in production
  devtool: "source-map",
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new FaviconsWebpackPlugin(path.join(__dirname, "public", "favicon.ico"),),
    new HtmlWebPackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: "./src/**/*.{ts,tsx,js,jsx}",
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/", to: "../" }],
    }),
    !DEV
      ? new CompressionPlugin({
          filename: "[path][base].gz",
          test: /\.(js|css|html|svg)$/,
          algorithm: "gzip",
        })
      : false,
    !DEV
      ? new CompressionPlugin({
          filename: "[path][base].br",
          test: /\.(js|css|html|svg)$/,
          algorithm: "brotliCompress",
        })
      : false,
    new NodePolyfillPlugin(),
  ].filter(Boolean),
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    historyApiFallback: true,
    open: true,
    overlay: true,
  },
};
