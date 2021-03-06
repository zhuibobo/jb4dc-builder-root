const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack');

module.exports = {
    // JavaScript 执行入口文件1
    entry: {
        /*"editTableSelectDefaultValue": './EditTable/Renderers/EditTable_SelectDefaultValue.js',*/
        "GatherBuildHousePersonMainPage": './BuildHousePerson/GatherBuildHousePersonMainPage.js',
        "GatherEventMainPage": './BuildHousePerson/GatherEventMainPage.js',
        "MockReadIdCardPage": './BuildHousePerson/MockReadIdCardPage.js',
        "GatherIndexMainPage": './BuildHousePerson/GatherIndexMainPage.js',
        "MockPhotoUploadPage": './BuildHousePerson/MockPhotoUploadPage.js',
        "DefaultIndexMainPage": './BuildHousePerson/DefaultIndexMainPage.js',
        "SearchIndexMainPage": './BuildHousePerson/SearchIndexMainPage.js',
        "ViewDemoPage": './BuildHousePerson/ViewDemoPage.js'
    },
    context: path.resolve(__dirname, ""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        //filename: '[name].[hash].js',
        filename: '[name].[hash].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, '../../resources/static/HTML/GridAppClient'),
        //path: path.resolve(__dirname, './dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: ""
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
            },
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false // 默认值是true，如果设置为 false，模版中 HTML 标签之间的空格将会被忽略。
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                loader: "file-loader",
                options: {
                    outputPath: 'Images',
                    name: '[name].[ext]',
                    esModule: false
                }
            },
            {
                test: /\CustTdRenderer\.js$/,
                use: [ 'script-loader' ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin (
            {
                cleanOnceBeforeBuildPatterns: ['*.js','*.css'],
            }
        ),
        new CopyWebpackPlugin({patterns:[
            { from: '**/LibJS/*.*',context: '', to: ''}
        ]}),
        new HtmlWebpackPlugin({
            filename: "ViewDemoPage.html",
            template: './Template.html',
            chunks: ['ViewDemoPage']
        }),
        new HtmlWebpackPlugin({
            filename: "GatherIndexMainPage.html",
            template: './Template.html',
            chunks: ['GatherIndexMainPage']
        }),
        new HtmlWebpackPlugin({
            filename: "DefaultIndexMainPage.html",
            template: './Template.html',
            chunks: ['DefaultIndexMainPage']
        }),
        new HtmlWebpackPlugin({
            filename: "SearchIndexMainPage.html",
            template: './Template.html',
            chunks: ['SearchIndexMainPage']
        }),
        new HtmlWebpackPlugin({
            filename: "GatherBuildHousePersonMainPage.html",
            template: './Template.html',
            chunks: ['GatherBuildHousePersonMainPage']
        }),
        new HtmlWebpackPlugin({
            filename: "GatherEventMainPage.html",
            template: './Template.html',
            chunks: ['GatherEventMainPage']
        }),
        new HtmlWebpackPlugin({
            filename: "MockReadIdCardPage.html",
            template: './Template.html',
            chunks: ['MockReadIdCardPage']
        }),
        new HtmlWebpackPlugin({
            filename: "MockPhotoUploadPage.html",
            template: './Template.html',
            chunks: ['MockPhotoUploadPage']
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            //filename: "[name].[hash].css",
            //chunkFilename: "[id].[hash].css"
            filename: "[name][hash].css",
            chunkFilename: "[id][hash].css"
        }),
        new VueLoaderPlugin()/*,
        new webpack.ProvidePlugin({
            EditTable_SelectDefaultValue1: ['./EditTable/Renderers/EditTable_SelectDefaultValue.js']
        })*/
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js'
        }
    },
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery'
    }
};