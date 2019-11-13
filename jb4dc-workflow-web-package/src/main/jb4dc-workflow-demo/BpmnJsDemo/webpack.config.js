var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    }
};

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

module.exports = [starter001,starter002];