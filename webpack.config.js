const path = require("path");
const webpack = require("webpack");
const SizePlugin = require("size-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    devtool: "source-map",
    stats: "errors-only",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    entry: {
        background: "./source/background/background.ts",
        options: "./source/options/options.ts",
        popup: "./source/react/Popup/index.tsx",
        tiddlerpicker: "./source/react/TiddlerPicker/index.tsx",
    },
    output: {
        path: path.join(__dirname, "distribution"),
        filename: "[name]/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx|jsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    externals: { lodash: "_" },
    plugins: [
        new SizePlugin(),
        new CopyWebpackPlugin([
            {
                from: "**/*",
                context: "source",
                ignore: ["*.js", "*.ts", "*.tsx"],
            },
            {
                from:
                    "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
            },

            {
                from: "node_modules/lodash/lodash.min.js",
            },
        ]),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: false,
                    output: {
                        beautify: true,
                        indent_level: 2, // eslint-disable-line camelcase
                    },
                },
            }),
        ],
    },
};
