'use strict';

const template = require('./job-board.html').default;

module.exports = app => app.component('job-board', {
  template: template
});