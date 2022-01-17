'use strict';

const app = Vue.createApp({
  template: `<app-component />`
});

require('./home')(app);
require('./navbar')(app);

app.component('app-component', {
  setup() {
    const auth = Vue.reactive({
      status: 'in_progress',
      serverVersion: null
    });

    Vue.provide('auth', auth);

    const state = Vue.reactive({ auth });
    return state;
  },
  template: `
    <div>
      <navbar></navbar>
      <home></home>
    </div>
  `
});

app.mount('#content');