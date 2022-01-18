'use strict';

const appendCSS = require('../appendCSS');
const css = require('./navbar.css');
const template = require('./navbar.html').default;

appendCSS(css);

module.exports = app => app.component('navbar', {
  inject: ['auth'],
  template: template
});