//webpack.config.js
var webpack = require('webpack');//引入Webpack模块供我们调用，这里只能使用ES5语法，使用ES6语法会报错
var path = require('path');
module.exports = {
    devtool: 'eval-source-map',//生成Source Maps,这里选择eval-source-map
    // entry: './app/main.js',//唯一入口文件
    entry:[ 'webpack-dev-server/client?http://localhost:8080',//资源服务器地址
            'webpack/hot/only-dev-server',
            './app/main.js'],
    output: {//输出目录
        path: __dirname + '/build/',//打包后的js文件存放的地方
        filename: 'bundle.js'//打包后输出的js的文件名
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader'//loader的名称（必须）
            },
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.(gif|png|jpg)$/, loader: 'url-loader?limit=8192'},
            {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {
                test: /\.js|jsx$/,
                loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0'],
                include: path.join(__dirname, 'js')
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()//热模块替换插件
    ],

    devServer: {
        contentBase: __dirname + '/build',//默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到"build"目录）
        historyApiFallback: true,//在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true,//设置为true，当源文件改变时会自动刷新页面
        hot:true,
        port: 8080,//设置默认监听端口，如果省略，默认为"8080"
    }
};