const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    // TODO: Add common Configuration
    module: {},
    mode: 'development',
    context:path.resolve(__dirname,""),
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    },
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery',
        "bpmn-js": "BpmnJS"
    }
};

var index000 = Object.assign({}, config, {
    name: "a",
    entry: {
        'index':'./src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin()],
    externals: {}
});

var starter001 = Object.assign({}, config, {
    name: "a",
    entry: {
        '001starter':'./src/001starter/001starter.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/001starter'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/001starter/template.html'
    })]
});

var starter002 = Object.assign({}, config, {
    name: "a",
    entry: {
        '002starter':'./src/002starter/002starter.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/002starter'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/002starter/template.html'
    })]
});

var starter003 = Object.assign({}, config, {
    name: "a",
    entry: {
        '003starter':'./src/003starter/003starter.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/003starter'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/003starter/template.html'
    })]
});

var colors004 = Object.assign({}, config, {
    name: "a",
    entry: {
        '003colors':'./src/004colors/004colors.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/004colors'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/004colors/template.html'
    })]
});

var interaction005 = Object.assign({}, config, {
    name: "a",
    entry: {
        '005interaction':'./src/005interaction/005interaction.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/005interaction'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/005interaction/template.html'
    })]
});

var overlays006 = Object.assign({}, config, {
    name: "a",
    entry: {
        '006overlays':'./src/006overlays/006overlays.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/006overlays'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/006overlays/template.html'
    })]
});

var urlviewer007 = Object.assign({}, config, {
    name: "a",
    entry: {
        '007url-viewer':'./src/007url-viewer/007url-viewer.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/007url-viewer'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/007url-viewer/template.html'
    })]
});

var modeler008 = Object.assign({}, config, {
    name: "a",
    entry: {
        '008modeler':'./src/008modeler/008modeler.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/008modeler'),
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: '**/*.css',context: 'src/008modeler', to: ''}
        ]),
        new HtmlWebpackPlugin({
            filename:"default.html",
            template: './src/008modeler/template.html'
        })
    ]
});

var commenting009 = Object.assign({}, config, {
    name: "a",
    entry: {
        '009commenting':'./src/009commenting/009commenting.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/009commenting'),
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: '**/*.css',context: 'src/009commenting', to: ''}
        ]),
        new HtmlWebpackPlugin({
            filename:"default.html",
            template: './src/009commenting/template.html'
        })
    ]
});

var bpmnproperties010 = Object.assign({}, config, {
    name: "a",
    entry: {
        '010bpmn-properties':'./src/010bpmn-properties/010bpmnProperties.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/010bpmn-properties'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename:"default.html",
        template: './src/010bpmn-properties/template.html'
    })]
});

module.exports = [
    index000,
    starter001,starter002,starter003,colors004,interaction005,
    overlays006,urlviewer007,modeler008,commenting009,bpmnproperties010
];