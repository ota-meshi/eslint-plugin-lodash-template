const path = require("path")
const webpack = require("webpack")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

function devtoolModuleFilenameTemplate({ resourcePath }) {
    return `playground/${resourcePath.replace(
        /^.*node_modules/u,
        "node_modules"
    )}`
}

module.exports = (_env, argv) => {
    const production = argv.mode === "production"
    return {
        entry: {
            app: path.resolve(__dirname, "./lib/main.js"),
        },
        output: {
            path: path.resolve(__dirname, "../assets"),
            filename: "[name].js",
            publicPath: "./assets/",
            devtoolModuleFilenameTemplate,
            devtoolFallbackModuleFilenameTemplate: devtoolModuleFilenameTemplate,
        },
        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js",
            },
            extensions: [".wasm", ".js", ".json", ".vue", ".mjs"],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/u,
                    loader: "vue-loader",
                },
                {
                    test: /\.(js|mjs)$/u,
                    loader: "babel-loader",
                    query: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: {
                                        browsers: [
                                            "last 2 versions",
                                            "not ie <= 10",
                                        ],
                                    },
                                    modules: false,
                                },
                            ],
                        ],
                        plugins: [
                            // Stage 2
                            [
                                "@babel/plugin-proposal-decorators",
                                { legacy: true },
                            ],
                            "@babel/plugin-proposal-function-sent",
                            "@babel/plugin-proposal-export-namespace-from",
                            "@babel/plugin-proposal-numeric-separator",
                            "@babel/plugin-proposal-throw-expressions",

                            // Stage 3
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-syntax-import-meta",
                            [
                                "@babel/plugin-proposal-class-properties",
                                { loose: false },
                            ],

                            "@babel/plugin-proposal-json-strings",
                        ],
                        comments: false,
                        compact: true,
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.css$/u,
                    use: ["vue-style-loader", "css-loader"],
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin(
                production
                    ? {
                          "process.env": {
                              NODE_ENV: '"production"',
                          },
                      }
                    : {}
            ),
            // new webpack.optimize.LimitChunkCountPlugin({
            //     maxChunks: 1,
            // }),
        ],
    }
}
