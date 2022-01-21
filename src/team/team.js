'use strict';

const template = require('./team.html').default;

module.exports = app => app.component('team', {
  template: template
});