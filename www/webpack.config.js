require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill", './src/js/app.js', './src/scss/index.scss'],
    output: {
        filename: './public/app.bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" ,
                query: {
                    presets: ['env'],
                    plugins: ["transform-object-rest-spread"]
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            }
        ]
    }
}