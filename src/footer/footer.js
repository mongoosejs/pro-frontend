'use strict';

const appendCSS = require('../appendCSS');
const css = require('./footer.css');
const template = require('./footer.html').default;

appendCSS(css);

module.exports = app => app.component('footer-component', {
  template: template
});