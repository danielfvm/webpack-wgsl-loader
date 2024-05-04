const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || "development",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.wgsl/,
        exclude: /node_modules/,
        use: {
          loader: 'webpack-wgsl-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  devtool: "source-map",
  devServer: {
    static: {
      directory: './dist/',
    },
    port: 8081,
    hot: false,
    liveReload: true,
  }
}
