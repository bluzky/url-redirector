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
          ["@babel/preset-env", {
            "targets": {
              "browsers": ["last 2 versions", "> 2%"]
            },
          }]
        ],
        "plugins": ["@babel/syntax-dynamic-import", ["@babel/plugin-transform-react-jsx", { "pragma":"h" }], "babel-plugin-transform-object-rest-spread", "@babel/plugin-transform-arrow-functions", "@babel/plugin-proposal-class-properties"]
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
