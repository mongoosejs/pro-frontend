'use strict';

const config = require('./.config');
const express = require('express');
const fs = require('fs');
const webpack = require('webpack');

const compiler = webpack(require('./webpack.config'));

const app = express();

app.use(express.static('./public'));
app.use('/vanillatoasts', express.static(__dirname + '/node_modules/vanillatoasts'));

const routes = require('./src/routes');

for (const { path } of routes) {
  app.get(path, function(req, res) {
    fs.readFile('./public/index.html', (err, index) => {
      if (err != null) {
        return res.status(500).send(err.message);
      }
      res.send(index.toString('utf8'));
    });
  });
}

const port = config.port || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});

if (process.env.NODE_ENV === 'development') {
  compiler.watch({}, (err, stats) => {
    if (err) {
      process.nextTick(() => { throw new Error('Error compiling bundle: ' + err.stack); });
    }
    if (stats.compilation.errors.length) {
      process.nextTick(() => { throw new Error('Error compiling bundle: ' + stats.compilation.errors[0].stack); });
    }
    console.log('Webpack compiled successfully');
  });
} else {
  compiler.run((err, stats) => {
    if (err) {
      process.nextTick(() => { throw new Error('Error compiling bundle: ' + err.stack); });
    }
    if (stats.compilation.errors.length) {
      process.nextTick(() => { throw new Error('Error compiling bundle: ' + stats.compilation.errors[0].stack); });
    }
    console.log('Webpack compiled successfully');
  });
}