const manifest = require("../manifest");

const plugins = [];

// html plugin 
// const htmlPlugin = new HtmlWebpackPlugin({  // Also generate a test.html
//   filename: 'index.html',
//   template: 'index.html'
// })

// plugins.push(htmlPlugin);


// extract plugin 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extractPlugin = 
  new MiniCssExtractPlugin({
    filename: manifest.outputFiles.css,
    //filename: "[name].css",
    allChunks: true,
  });

// copy plugin
const path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin')

const copyPlugin = new CopyWebpackPlugin([
  {
    from: path.join(manifest.paths.src, 'static/fonts'),
    to: path.join(manifest.paths.build, 'fonts')
  },
  {
    from: path.join(manifest.paths.src, 'static/images'),
    to: path.join(manifest.paths.build, 'images')
  }
])


plugins.push(copyPlugin);

// internal plugins

const webpack = require("webpack");

// ---------------
// @Common Plugins
// ---------------


plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(manifest.NODE_ENV)
    }
  }),

  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    Popper: ["popper.js", "default"]
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
);



// ----------------------------
// @Merging Development Plugins
// ----------------------------
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
if (manifest.IS_DEVELOPMENT) {
  plugins.push(
    new BundleAnalyzerPlugin()
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin()
  );
}




module.exports = plugins;
