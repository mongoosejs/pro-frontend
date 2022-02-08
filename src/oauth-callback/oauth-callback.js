'use strict';

const api = require('../api');
const template = require('./oauth-callback.html').default;

module.exports = app => app.component('oauth-callback', {
  inject: ['auth', 'subscriber'],
  template: template,
  async mounted() {
    const params = new URLSearchParams(window.location.search.replace(/^\?/, ''));
    
    const { token, subscriber } = await api.get('/api/githubLogin?code=' + params.get('code')).
      then(res => res.data);
    window.localStorage.setItem('_mongooseProToken', token._id);

    if (subscriber == null) {
      this.auth.status = 'not_a_subscriber';
      this.auth.accessToken = token._id;

      this.$router.push('/not-subscriber');
    } else {
      this.auth.status = 'logged_in';
      this.auth.accessToken = token._id;
      this.auth.subscriber = subscriber._id;
      this.subscriber.subscriber = subscriber;
  
      this.$router.push('/profile');
    }
  }
});