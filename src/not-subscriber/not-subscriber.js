'use strict';

const template = require('./not-subscriber.html').default;

const appendCSS = require('../appendCSS');
const css = require('./not-subscriber.css');

appendCSS(css);

module.exports = app => app.component('not-subscriber', {
  template: template
});