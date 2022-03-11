const getRepoInfo = require('git-repo-info')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const gitInfo = getRepoInfo()

module.exports = (env) => {
  const isDev = env !== 'production'
  const mode = isDev ? 'development' : 'production'
  // When deploying to GH pages, the app will not be served at the root
  const BASE_PATH = isDev ? '/' : '/vr-experiments'
  return {
    entry: './src/index.tsx',
    output: {
      publicPath: '/',
    },
    target: 'web',
    plugins: [
      new webpack.EnvironmentPlugin({GIT_REV: gitInfo.sha, NODE_ENV: mode, BASE_PATH}),
      new HTMLPlugin({
        title: 'VR Experiments',
        meta: {
          viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
        },
        template: 'src/index.ejs',
      }),
      new ReactRefreshPlugin(),
    ].filter(Boolean),
    devtool: isDev ? 'cheap-module-source-map' : 'source-map',
    mode,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {cacheDirectory: true, envName: mode},
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(eot|otf|svg|ttf|woff|woff2|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    devServer: {
      // WebXR requires HTTPS
      https: true,
      historyApiFallback: true,
      host: 'local-ipv4',
      hot: true,
      open: true,
      devMiddleware: {
        stats: 'minimal',
      },
      allowedHosts: 'all',
    },
  }
}
