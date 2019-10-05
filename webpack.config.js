const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let productPackage = require('./package');

let devtool, scssLoaders, plugins, styleLoaders;
const development = process.env.NODE_ENV !== 'production';

scssLoaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: development
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [autoprefixer()],
      sourceMap: development
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: development
    }
  },
];

function getDefinePlugin() {
    let config = {
        // Do not expose debug/logs in production environment
        DEBUG  : JSON.stringify(development),
        VERSION: JSON.stringify(productPackage.version)
    };

    return new webpack.DefinePlugin(config);
}

if (development === true) {
  // Development
  devtool = 'inline-source-map';
  styleLoaders = [
    'style-loader',
    ...scssLoaders
  ];
  plugins = [getDefinePlugin(), new webpack.HotModuleReplacementPlugin()];
} else {
  // Production  
  styleLoaders = [{
      loader: MiniCssExtractPlugin.loader,
    },
    ...scssLoaders
  ];
  plugins = [getDefinePlugin(), 
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ];
}

module.exports = {
  devtool,
  devServer: {
    contentBase: './www',
    hot: development
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  mode: development ? 'development' : 'produdction',
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: styleLoaders,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ],
  },
  plugins
};