'use strict';

const api = require('../api');
const template = require('./team.html').default;
const vanillatoasts = require('vanillatoasts');

module.exports = app => app.component('team', {
  template: template,
  inject: ['auth', 'subscriber'],
  data: () => ({ status: 'init', githubOrganization: '' }),
  mounted() {
    this.githubOrganization = this.subscriber.subscriber.githubOrganization;
  },
  methods: {
    async updateSubscriber() {
      const body = {
        _id: this.subscriber.subscriber._id,
        githubOrganization: this.githubOrganization
      };
      const opts = { headers: { authorization: this.auth.accessToken } };
      this.status === 'saving';

      let res;
      try {
        res = await api.post(`/api/updateSubscriber`, body, opts).then(res => res.data.subscriber);
      } catch (err) {
        console.log(err);
        vanillatoasts.create({
          title: `HTTP ${err.response.status}: ${err.response.data ? err.response.data.message : 'No response'}`,
          icon: '/images/red-x.svg',
          timeout: 8000,
          positionClass: 'bottomRight'
        });
        return
      }

      this.githubOrganization = res.githubOrganization;

      this.subscriber.subscriber.githubOrganization = res.githubOrganization;
      this.subscriber.subscriber.githubOrganizationId = res.githubOrganizationId;

      this.status = 'saved';

      vanillatoasts.create({
        title: 'GitHub Organization Updated!',
        icon: '/images/check-green.svg',
        timeout: 8000,
        positionClass: 'bottomRight'
      });
    }
  }
});