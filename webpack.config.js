const path = require('path');
module.exports = {
    mode: "development",
    entry: "./app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "")
    },
    // watch:true
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, ''),
        compress: true,
        /* watchContentBase: true */
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};