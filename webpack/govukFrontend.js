const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('govuk-frontend');
const root = path.resolve(rootExport, '..');
const sass = path.resolve(root, 'all.scss');
const javascript = path.resolve(root, 'all.js');
const components = path.resolve(root, 'components');
const macros = path.resolve(root, 'macros');
const assets = path.resolve(root, 'assets');
const images = path.resolve(assets, 'images');
const fonts = path.resolve(assets, 'fonts');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
    { from: `${root}/template.njk`, to: '../views/govuk' },
    { from: `${root}/components`, to: '../views/govuk/components' },
    { from: `${root}/macros`, to: '../views/govuk/macros' },
    { from: `${assets}/manifest.json`, to: 'assets/manifest.json' },
  ],
});

module.exports = {
  paths: { template: root, components, macros, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};
