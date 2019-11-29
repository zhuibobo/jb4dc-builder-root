const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // JavaScript 执行入口文件
    entry: {
        "App": './App.js'
    },
    context: path.resolve(__dirname, ""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './Dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                        loader: miniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output

                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    }, {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    }]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "Index.html",
            template: './Template.html'
        }),
        new miniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery',
        "bpmn-js": "BpmnJS"
    }
};