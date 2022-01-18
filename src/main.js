'use strict';

const app = Vue.createApp({
  template: `<app-component />`
});

const api = require('./api');

require('./home')(app);
require('./navbar/navbar')(app);
require('./profile/profile')(app);

app.component('app-component', {
  setup() {
    const accessToken = window.localStorage.getItem('_mongooseProToken') || null;

    const auth = Vue.reactive({
      status: 'in_progress',
      accessToken: accessToken
    });

    Vue.provide('auth', auth);

    const state = Vue.reactive({ auth });
    return state;
  },
  async mounted() {
    if (this.auth.accessToken == null) {
      this.auth.status = 'logged_out';
      return;
    }

    const opts = { headers: { authorization: this.auth.accessToken } };
    const { exists } = await api.get('/api/verifyGithubAccessToken', opts).
      then(res => res.data).
      catch(err => {
        return { exists: false };
      });
    if (exists) {
      this.auth.status = 'logged_in';
    } else {
      this.auth.status = 'logged_out';
    }
  },
  template: `
    <div>
      <navbar />
      <router-view />
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

// Set the correct initial route: https://github.com/vuejs/vue-router/issues/866
router.replace(window.location.pathname);

app.use(router);

app.mount('#content');