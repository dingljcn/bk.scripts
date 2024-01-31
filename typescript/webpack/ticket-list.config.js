const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    entry: './src/dev/script/ticket-list/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "core": resolve("../src/core"),
            "dev": resolve("../src/dev"),
        }
    },
    output: {
        filename: 'index.compile.min.js',
        path: path.resolve(__dirname, '../../src/script/ticket-list'),
    },
};