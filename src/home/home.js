'use strict';

const template = require('./home.html').default;

module.exports = app => app.component('home', {
  inject: ['auth'],
  template: template
});