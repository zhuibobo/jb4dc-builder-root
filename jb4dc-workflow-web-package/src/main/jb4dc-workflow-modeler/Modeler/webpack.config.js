const path = require('path');

module.exports = {
    // JavaScript 执行入口文件
    entry:{
        "App":'./App.js'
    },
    context:path.resolve(__dirname,""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './Dist'),
    },
    mode:'development',
    module: {
        rules: [
            {
                // 用正则去匹配要用该 loader 转换的 CSS 文件
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery',
        "bpmn-js": "BpmnJS"
    }
};