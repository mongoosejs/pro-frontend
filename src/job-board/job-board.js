'use strict';

const api = require('../api');
const appendCSS = require('../appendCSS');
const css = require('./job-board.css');
const template = require('./job-board.html').default;
const vanillatoasts = require('vanillatoasts');

appendCSS(css);

module.exports = app => app.component('job-board', {
  inject: ['auth'],
  data: () => ({ status: 'in_progress', jobs: [] }),
  async mounted() {
    const jobs = await api.post(
      '/api/findJobsBySubscriber',
      { _id: this.auth.subscriberId },
      { headers: { authorization: this.auth.accessToken } }
    ).then(res => res.data.jobs);

    if (jobs.length === 0) {
      this.pushJob(jobs);
    }
    this.jobs = jobs;
    this.status = 'loaded';
  },
  methods: {
    pushJob(jobs) {
      if (jobs.length >= 2) {
        return;
      }
      jobs.push({
        url: '',
        title: '',
        location: '',
        description: ''
      });
    },
    async save() {
      const body = {
        _id: this.auth.subscriberId,
        jobs: this.jobs
      };
      const opts = { headers: { authorization: this.auth.accessToken } };
      this.status === 'saving';

      let res;
      try {
        res = await api.post(`/api/updateJobs`, body, opts).then(res => res.data);
      } catch (err) {
        vanillatoasts.create({
          title: `HTTP ${err.response.status}: ${err.response.data ? err.response.data.message : 'No response'}`,
          icon: '/images/red-x.svg',
          timeout: 8000,
          positionClass: 'bottomRight'
        });
        return
      }

      this.jobs = res.jobs;

      this.status = 'saved';

      vanillatoasts.create({
        title: 'Jobs submitted for approval!',
        icon: '/images/check-green.svg',
        timeout: 8000,
        positionClass: 'bottomRight'
      });
    }
  },
  template: template
});