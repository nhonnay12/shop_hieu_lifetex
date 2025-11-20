// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack').ids;
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',

        publicPath: '/',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'), // Alias setup for module resolution
        },
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            (compiler) => {
                new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        compress: {
                            comparisons: false,
                        },
                        mangle: true,
                        output: {
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                }).apply(compiler);
            },
        ],
        nodeEnv: 'production',
        sideEffects: true,
        concatenateModules: true,
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
                main: {
                    chunks: 'all',
                    minChunks: 2,
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        },
        runtimeChunk: true,
    },
    resolve: {
        fallback: {
            crypto: false,
            'process/browser': require.resolve('process/browser'),
            extensions: ['.js', '.jsx'],
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            inject: true,
        }),
        new MiniCssExtractPlugin(),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new WebpackPwaManifest({
            name: 'React Boilerplate',
            short_name: 'React BP',
            description: 'My React Boilerplate-based project!',
            background_color: '#fafafa',
            theme_color: '#b1624d',
            inject: true,
            ios: true,
            icons: [],
        }),
        new HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
        new BundleAnalyzerPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Conditionally use 'style-loader' for dev, 'MiniCssExtractPlugin' for prod
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'assets/images/img',
                            publicPath: '/assets/images/img',
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    performance: {
        assetFilter: (assetFilename) => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};
