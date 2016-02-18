var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var qs = require('qs');
var webpack = require('webpack');
var merge = require('webpack-merge');

var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;

var NODE_PATH = path.join(__dirname, 'node_modules');
var SOURCE_PATH = path.join(__dirname, 'src');

var common = {
  context: SOURCE_PATH,
  entry: {
    app: [
      // Main entry point.
      './index.js'
    ]
  },
  output: {
    filename: '[name].js',
    pathInfo: true,
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    // All imports from external files should fallback
    // to this project's Node module directory.
    fallback: NODE_PATH
  },
  resolveLoader: {
    // All Webpack loaders needed for external files should fallback
    // to this project's Node module directory.
    fallback: NODE_PATH
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.svg$/,
        loader: 'raw'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer];
  }
};

if(TARGET === 'dev' || TARGET === 'build') {
  module.exports = merge.smart(common, {
    // Set loaders to debug mode.
    debug: true,
    // Generate source maps, so it's easier to find errors in code.
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      // Ignore injecting code with errors.
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [
        makeCSSLoader('[name]-[local]_[hash:base64:5]'),
        makeJSLoader(true)
      ]
    }
  });
}

if(TARGET === 'dist') {
  module.exports = merge.smart(common, {
    module: {
      loaders: [
        makeCSSLoader('[hash:base64:5]'),
        makeJSLoader(false)
      ]
    }
  });
}

function makeCSSLoader(localIdentName) {
  return {
    test: /\.(css|less)$/,
    loaders: [
      'style',
      'css?modules&localIdentName=' + localIdentName,
      'postcss',
      'less'
    ]
  };
}

function makeJSLoader(isHot) {
  // Transform Babel config to Webpack query string.
  // This ensures Babel will use this config when compiling external
  // source code, instead of only using the config for internal source code.
  var babelrc = require('fs').readFileSync(path.join(__dirname, '.babelrc'), 'utf8');
  var babelQuery = '?' + qs.stringify(
    JSON.parse(babelrc),
    {
      arrayFormat: 'brackets',
      encode: false
    }
  );

  var loader = {
    test: /\.(js|jsx)$/,
    // Ignore processing any node modules except for explicit ones.
    // This speeds development and prevents potential issues.
    exclude: /node_modules/,
    loaders: [
      'babel' + babelQuery
    ]
  };

  if(isHot) {
    loader.loaders.unshift('react-hot');
  }

  return loader;
}
