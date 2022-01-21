'use strict';

const api = require('../api');
const template = require('./oauth-callback.html').default;

module.exports = app => app.component('oauth-callback', {
  inject: ['auth'],
  template: template,
  async mounted() {
    const params = new URLSearchParams(window.location.search.replace(/^\?/, ''));
    
    const { token, subscriber } = await api.get('/api/githubLogin?code=' + params.get('code')).
      then(res => res.data);
    window.localStorage.setItem('_mongooseProToken', token._id);

    this.auth.status = 'logged_in';
    this.auth.accessToken = token._id;
    this.auth.user = subscriber;

    this.$router.push('/profile');
  }
});