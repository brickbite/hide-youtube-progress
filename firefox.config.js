// webpack config file for firefox

const path = require('path');

module.exports = {
  entry: './src/browser/firefox/contentScript.js',
  mode: 'none',
  output: {
    filename: 'contentScript.js',
    path: path.resolve(__dirname, 'dist/firefox'),
  },
};
