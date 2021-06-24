// webpack config file for chrome

const path = require('path');

module.exports = {
  entry: './src/browser/chrome/contentScript.js',
  mode: 'none',
  output: {
    filename: 'contentScript.js',
    path: path.resolve(__dirname, 'dist/chrome'),
  },
};
