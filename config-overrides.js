const {
  override,
  fixBabelImports,
  addWebpackAlias,
  adjustStyleLoaders
} = require('customize-cra');

const path = require("path");
module.exports = override(
  //按需加载antd
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css', // true是less，如果不用less style的值可以写'css' 
  }),

  //别名配置
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "./src")
  }),
  
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources:'./src/assets/css/index.scss'  //全局引入
        }
      })
    }
  }),


  (config) => {
    config.target = 'electron-renderer';
    return config;
  }
);
