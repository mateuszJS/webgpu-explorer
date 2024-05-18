const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// https://socket.dev/npm/package/prerender-ssg-webpack-plugin
// it might be want we want for SSG

module.exports = {
  entry: ["./src/index.ts", "/src/styles/index.scss"], // do we need .scss entry point??
  devtool: "eval-source-map",
  devServer: {
    static: "./dist", // do we need it??
    historyApiFallback: true // fallbakc to index.html while url not found
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    /* useful with absolute imports, "src" dir now takes precedence over "node_modules",
    otherwise you got an error:
    Requests that start with a name are treated as module requests and resolve within module directories (node_modules).
    */
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.inline\.html/,
      //   type: "asset/source",
      // },
      // {
      //   test: /\.inline2\.html/,
      //   loader: path.resolve('src/html-loader/loader.js'),
      //   type: "asset/source",
      // },
      {
        test: /\.heart/,
        loader: path.resolve('src/html-loader/loader.js'),
      },
      {
        test: /\.inline\.svg/,
        type: "asset/source",
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            test: /\.raw\.scss$/,
            use: [
              {
                loader: "css-loader",
                options: {
                  exportType: "string",
                },
              },
              "sass-loader",
            ]
          },
          {
            use: [
              process.env.NODE_ENV !== "production"
                ? "style-loader" :
                MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
            ],
          }
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: "[chunkhash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single", // do we need that?
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      baseURI: process.env.BASE_URI
    }),
    new MiniCssExtractPlugin({
      filename: "[chunkhash].bundle.css"
    }),
  ],
};
