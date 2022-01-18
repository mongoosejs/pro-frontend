'use strict';

const appendCSS = require('../appendCSS');
const css = require('./profile.css');
const template = require('./profile.html').default;

// appendCSS(css);

module.exports = app => app.component('profile', {
  inject: ['auth'],
  template: template
});