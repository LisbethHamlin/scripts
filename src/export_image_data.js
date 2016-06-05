'use strict';

const fs = require('fs'),
    sizeOf = require('image-size'),
    common = require('./common');

function getImageSize(image) {
  const imageSize = sizeOf(image);
  return imageSize.width.toString() + 'x' + imageSize.height.toString();
}

function removeExtension(image) {
  return image.replace(/\.[^/.]+$/, "");
}

function splitPath(path) {
  return path.split(/\/+/g);
}

let rootDirectory = process.argv[2];
const PORTFOLIO_OUT_FILE = rootDirectory + '/_data/portfolio.json',
      TEASER_IMAGE_PATTERN = '.+-teaser';

if(!rootDirectory) {
  console.log('Specify a directory');
  return;
}

rootDirectory += '/images/portfolio';
rootDirectory = rootDirectory.replace(/\\/g, '/');

let results = [];
common.walk(rootDirectory, results, function(error) {
  if(error) {
    throw error;
  }

  results = results.filter(function(value) {
    return value.search(TEASER_IMAGE_PATTERN) === -1;
  });

  const portfolio = {};
  results.forEach(function(value) {
    const splitValues = splitPath(value),
          group = splitValues.slice(-2)[0],
          title = splitValues.slice(-1)[0];

    portfolio[group] = portfolio[group] || [];
    portfolio[group].push({
      title: removeExtension(title),
      size: getImageSize(value)
    });
  });

  fs.writeFile(PORTFOLIO_OUT_FILE, JSON.stringify(portfolio, null, 2), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(PORTFOLIO_OUT_FILE + ' successfully created.');
  });
});
