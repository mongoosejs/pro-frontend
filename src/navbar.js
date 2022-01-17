'use strict';

const template = require('./navbar.html').default;

const css = require('./navbar.css');

const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');
head.appendChild(style);
style.appendChild(document.createTextNode(css));

module.exports = app => app.component('navbar', {
  inject: ['auth'],
  template: template
});