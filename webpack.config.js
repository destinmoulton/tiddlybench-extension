const path = require("path");
const SizePlugin = require("size-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    devtool: "source-map",
    stats: "errors-only",
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    entry: {
        background: "./source/background.ts",
        options: "./source/options.ts",
        popup: "./source/popup.ts",
    },
    output: {
        path: path.join(__dirname, "distribution"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new SizePlugin(),
        new CopyWebpackPlugin([
            {
                from: "**/*",
                context: "source",
                ignore: ["*.js"],
            },
            {
                from:
                    "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
            },
            {
                from: "node_modules/base-64/base64.js",
            },
        ]),
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
