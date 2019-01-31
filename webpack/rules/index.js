const manifest = require('../manifest');

module.exports = [
  // vue
  // {
  //   test: /\.vue$/,
  //   loader: 'vue-loader',
  //   options: {
  //     loaders: {
  //       js: 'babel-loader'
  //     }
  //   }
  // },

  // preact

  // {
	// 	test: /\.jsx?$/,
	// 	exclude: manifest.paths.src,
	// 	enforce: 'pre',
	// 	use: 'source-map-loader'
	// },
	// {
	// 	test: /\.jsx?$/,
	// 	exclude: /node_modules/,
	// 	use: 'babel-loader'
	// },

  // js
  {
    test    : /\.(js)$/,
    exclude : /(node_modules|build|dist\/)/,
    use     : [{
      loader: 'babel-loader',
      options: {
        "presets": [
          ["env", {
            "targets": {
              "browsers": ["last 2 versions", "> 2%"]
            },
            jsxPragma: "h"
          }]
        ],
        "plugins": ["syntax-dynamic-import", ["transform-react-jsx", { "pragma":"h" }], "babel-plugin-transform-object-rest-spread"]
      }
    }],
  },

  // image
  {
    test: /\.(png|gif|jpg|svg)$/i,
    use: [
      {
        loader: 'url-loader?limit=20000',
        options: {
          outputPath: 'images'
        }
      }
    ]
  },
  require('./css'),
  require('./sass'),

  // fonts
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    //  exclude: /(node_modules)/,
    use: {
      loader: 'url-loader?limit=100000',
      options: {
        outputPath: 'fonts'
      }
    }
  }
]
