const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PuppeteerPrerenderPlugin = require('puppeteer-prerender-plugin').PuppeteerPrerenderPlugin
const { HeartPlugin } = require('./src/heart-loader/plugin.js');

const isProd = process.env.NODE_ENV === 'production'

const pathToSSG = {
  '/projects/setup': {title:'Project 1 Overview'},
  '/projects/setup/steps/0': {title:'Project 1 - Steps'},
  '/': {title: 'Home'},
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["./src/index.ts"],
  devtool: isProd ? undefined : "eval-source-map",
  watch: !isProd,
  devServer: {
    // static: "./dist", // do not use it. It's gonna serve last SSG pages while dev mode
    historyApiFallback: true // fallback to index.html while 404
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
        test: /\.txt$/,
        type: "asset/resource",
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.json5$/,
        loader: path.resolve('src/heart-loader/json5.js'),
        type: "asset/resource",
      },
      {
        test: /\.heart$/,
        loader: path.resolve('src/heart-loader/loader.js'),
      },
      {
        test: /\.inline\.html$/,
        type: "asset/source",
      },
      {
        test: /\.inline\.svg$/,
        type: "asset/source",
      },
      isProd
        ? {
          test: /\.css$/,
          use: [
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    ["cssnano"],
                    // preset: advanced got us almsot no optimization, and
                    //counter is impossible to use then, it changes the name
                  ],
                },
              },
            },
          ],
          type: "asset/source",
        } : {
          test: /\.css$/,
          use: ['style-loader', "css-loader"]
        },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    // https://webpack.jakoblind.no/optimize/ suppose to give you suggestion how to improve build
    runtimeChunk: "single", // split runtime code into a separate chunk using the
    // looks like it's needed because each deployment, reach changes something
    // so [contenthash] also gonna change each time
    // it contains references to all modules, so changes in each deployment

    moduleIds: 'deterministic', /* still some modules can change because order of improts has changed
    so with deterministic module id, the order won't matter!! contenthash should stay the same*/
  },
  plugins: [
    new HeartPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
      new PuppeteerPrerenderPlugin({
        enabled: isProd,
        entryDir: path.join(__dirname, 'dist'),
        outputDir: path.join(__dirname, 'dist'),
        renderAfterTime: 5000, // * 10,
        injections: [{ key: 'isSSG', value: true }],
        postProcess: (result) => {
          result.html = result.html
            .replace(
              '<base href="/">',
              `<base href="${process.env.BASE_URI}">`,
            )
            .replace(
              /<link rel="stylesheet" href=(.*?)>/,
              `<link rel="preload" href=$1 as="style" onload="this.onload=null;this.rel='stylesheet'">`
              // idea from https://web.dev/articles/defer-non-critical-css
            )
            .replace(
              '<title></title>',
              '<title>' + pathToSSG[result.route]?.title + '</title>'
            )
            .replace(
              /mounted="true"/g,
              'mounted="true" hydration="true"'
            )
        },
        routes: Object.keys(pathToSSG),
        // puppeteerOptions: {
        //   headless: false,
        //   devtools: true,
        // },
    }),
    isProd && new BundleAnalyzerPlugin({
      analyzerMode: 'static' // 'server' had issue running along with PrerendererWebpackPlugin
    }),
  ],
};
