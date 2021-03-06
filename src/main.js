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
require('./not-subscriber/not-subscriber')(app);
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
      _initialAuthResolve(this.auth.status);
      return;
    }

    const opts = { headers: { authorization: this.auth.accessToken } };
    const { exists, token } = await api.get('/api/verifyGithubAccessToken', opts).
      then(res => res.data).
      catch(err => {
        return { exists: false };
      });
      console.log(this.$router.currentRoute);
    if (exists) {
      if (token.subscriberId == null) {
        this.auth.status = 'not_a_subscriber';
        if (this.$router.currentRoute.value.meta.requireLogin) {
          this.$router.push('/not-subscriber');
        }
      } else {
        this.auth.status = 'logged_in';
        this.auth.subscriberId = token.subscriberId._id;
        this.subscriber.subscriber = token.subscriberId;
      }

      _initialAuthResolve(this.auth.status);
    } else {
      this.auth.status = 'logged_out';
      this.auth.subscriberId = null;
      this.subscriber.subscriber = null;
      _initialAuthResolve(this.auth.status);
    }
  },
  template: `
    <div>
      <navbar />
      <div v-if="!$router.currentRoute.value.meta.requireLogin || auth.status !== 'in_progress'">
        <router-view />
      </div>
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

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next({path: '/404'});
    return;
  }

  if (to.meta && to.meta.requireLogin) {
    if (!window.localStorage.getItem('_mongooseProToken')) {
      next('/');
      return;
    }

    initialAuthCheck.then(status => {
      if (status === 'logged_out') {
        next('/');
        return;
      }

      return next();
    });
    return;
  }

  next();
});

// Set the correct initial route: https://github.com/vuejs/vue-router/issues/866
router.replace(window.location.pathname);

app.use(router);

app.mount('#content');