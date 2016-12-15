module.exports = {
    entry: './src/index.ts',

    output: {
        filename: './dist/bundle.js'
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ]
    },

    resolve: {
        extensions: ['.ts']
    },

    devtool: "source-map"
};