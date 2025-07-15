const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('govuk-frontend');
const root = path.dirname(rootExport);
const sass = path.join(root, 'all.scss');
const javascript = path.join(root, 'all.js');
const components = path.join(root, 'components');
const macros = path.join(root, 'macros');
const assets = path.join(root, 'assets');
const images = path.join(assets, 'images');
const fonts = path.join(assets, 'fonts');

const copyGovukTemplateAssets = new CopyPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
    { from: path.join(root, '/template.njk'), to: '../views/govuk' },
    { from: path.join(root, '/components'), to: '../views/govuk/components' },
    { from: path.join(root, '/macros'), to: '../views/govuk/macros' },
    { from: path.join(assets, 'manifest.json'), to: 'assets/manifest.json' },
  ],
});

module.exports = {
  paths: { template: root, components, macros, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};
