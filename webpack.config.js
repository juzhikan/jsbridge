var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "snail": "./src/snail/snail.js",
        "comic": "./src/comic/comic.js"
    },
    output: {
        path: path.join(__dirname, 'dist'),
		filename: "bridge.[name].js",
		library: ["Bridge", "[name]"],
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [

            {
                test: /\.jsx?$/,
                use: [
                    // {
                    //     loader: "es3ify-loader"
                    // },
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        ]
    }
};
