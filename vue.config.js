// module.exports = {
//     //axios域代理，解决axios跨域问题
//     publicPath: '/',
//     devServer: {
//         proxy: {
//             '': {

//                 // 打包前先注释
//                 // target: 'http://175.178.60.146:85',

//                 target: 'https://api.gggcli.com:85',
//                 changeOrigin: true,
//                 ws: true,
//                 pathRewrite: {
//                     ' ^/': ''
//                 }
//             }
//         }
//     }
// }
module.exports = {
    css: {
      loaderOptions: {
        sass: {
          implementation: require('sass'),
        },
      },
    },
  };