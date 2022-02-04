'use strict';

const api = require('../api');
const appendCSS = require('../appendCSS');
const css = require('./team.css');
const template = require('./team.html').default;
const vanillatoasts = require('vanillatoasts');

appendCSS(css);

module.exports = app => app.component('team', {
  template: template,
  inject: ['auth', 'subscriber'],
  data: () => ({ status: 'init', githubOrganization: '' }),
  mounted() {
    this.githubOrganization = this.subscriber.subscriber.githubOrganization;
  },
  methods: {
    groupsOf(arr, num) {
      if (arr == null || arr.length === 0) {
        return [];
      }

      const ret = [];
      for (let i = 0; i < arr.length; i += num) {
        ret.push(arr.slice(i, i + num));
      }
      console.log('AA', ret);
      return ret;
    },
    async updateGithubOrganizationMembers() {
      const body = {
        _id: this.subscriber.subscriber._id,
        githubOrganization: this.githubOrganization
      };
      const opts = { headers: { authorization: this.auth.accessToken } };
      this.status === 'saving';

      let res;
      try {
        res = await api.post(`/api/updateGithubOrganizationMembers`, body, opts).then(res => res.data.subscriber);
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

      this.subscriber.subscriber.githubOrganizationMembers = res.githubOrganizationMembers;
    
      vanillatoasts.create({
        title: 'GitHub organization members updated!',
        icon: '/images/check-green.svg',
        timeout: 8000,
        positionClass: 'bottomRight'
      });
    },
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