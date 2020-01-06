const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log(path.resolve(__dirname,""));
module.exports = {
    // JavaScript 执行入口文件
    entry: './002mmain.js',
    context:path.resolve(__dirname,""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: '002bundle.js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist'),
    },
    mode:'development',
    module: {
        rules: [
            {
                // 用正则去匹配要用该 loader 转换的 CSS 文件
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../'
                        }
                    },
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]filename.css",
            chunkFilename: "[id]chunkFilename.css"
        })
    ]
};