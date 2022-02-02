'use strict';

const appendCSS = require('../appendCSS');
const css = require('./navbar.css');
const template = require('./navbar.html').default;

appendCSS(css);

module.exports = app => app.component('navbar', {
  inject: ['auth'],
  template: template,
  methods: {
    active(name) {
      if (this.$router.currentRoute.value.name === name) {
        return 'active';
      }
      return '';
    },
    logout() {
      this.auth.status = 'logged_out';
      this.auth.accessToken = null;
      this.auth.user = null;
      window.localStorage.removeItem('_mongooseProToken');

      this.$router.push('/');
    }
  }
});