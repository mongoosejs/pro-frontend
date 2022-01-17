'use strict';

const template = require('./navbar.html').default;

module.exports = app => app.component('navbar', {
  inject: ['auth'],
  template: template
});