'use strict';

const app = Vue.createApp({
  template: `<app-component />`
});

const api = require('./api');
Object.assign(app.config.globalProperties, {
  githubLoginURL: `https://github.com/login/oauth/authorize?client_id=${__githubOAuthClientId}`
});

require('./home/home')(app);
require('./footer/footer')(app);
require('./job-board/job-board')(app);
require('./navbar/navbar')(app);
require('./oauth-callback/oauth-callback')(app);
require('./profile/profile')(app);
require('./team/team')(app);

let _initialAuthResolve = null;
let initialAuthCheck = new Promise((resolve) => {
  _initialAuthResolve = resolve;
});

app.component('app-component', {
  setup() {
    const accessToken = window.localStorage.getItem('_mongooseProToken') || null;

    const auth = Vue.reactive({
      status: 'in_progress',
      accessToken: accessToken,
      subscriberId: null,
      subscriber: null
    });
    Vue.provide('auth', auth);

    const subscriber = Vue.reactive({
      subscriber: null
    });
    Vue.provide('subscriber', subscriber);

    const state = Vue.reactive({ auth, subscriber });

    window.__state = state;

    return state;
  },
  async mounted() {
    if (this.auth.accessToken == null) {
      this.auth.status = 'logged_out';
      _initialAuthResolve();
      return;
    }

    const opts = { headers: { authorization: this.auth.accessToken } };
    const { exists, token } = await api.get('/api/verifyGithubAccessToken', opts).
      then(res => res.data).
      catch(err => {
        return { exists: false };
      });
    if (exists) {
      this.auth.status = 'logged_in';
      this.auth.subscriberId = token.subscriberId._id;
      this.subscriber.subscriber = token.subscriberId;
      _initialAuthResolve();
    } else {
      this.auth.status = 'logged_out';
      this.auth.subscriberId = null;
      this.subscriber.subscriber = null;
      _initialAuthResolve();
    }
  },
  template: `
    <div>
      <navbar />
      <router-view />
      <footer-component />
    </div>
  `
});

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: require('./routes').map(route => ({
    ...route,
    component: app.component(route.name)
  }))
});

router.beforeEach((from, to, next) => {
  if (from.meta.requireLogin) {
    initialAuthCheck.then(() => next());
    return;
  }
  return next();
});

// Set the correct initial route: https://github.com/vuejs/vue-router/issues/866
router.replace(window.location.pathname);

app.use(router);

app.mount('#content');