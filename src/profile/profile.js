'use strict';

const appendCSS = require('../appendCSS');
const css = require('./profile.css');
const template = require('./profile.html').default;
const api = require('../api');
const validator = require('validator');
const vanillatoasts = require('vanillatoasts');

appendCSS(css);

module.exports = app => app.component('profile', {
  inject: ['auth'],
  data: function() {
    return {
      status: 'init',
      company: '',
      description: '',
      logo: '',
      name: '',
      error: ''
    }
  },
  template: template,
  mounted: async function() {
    this.company = this.auth.subscriber.companyName;
    this.description = this.auth.subscriber.description;
    this.logo = this.auth.subscriber.logo;
    this.name = this.auth.subscriber.githubUsername;
  },
  computed: {
    logoURL() {
      if (!this.logo || !validator.isURL(this.logo)) {
        return '/images/dog1.webp';
      }

      return this.logo;
    }
  },
  methods: {
    async updateSubscriber() {
      if(!validator.isURL(this.logo)) {
        this.status = 'error';
        this.error = 'Please enter a valid url';

        vanillatoasts.create({
          title: this.error,
          icon: '/images/red-x.svg',
          timeout: 8000,
          positionClass: 'bottomRight'
        });

        return;
      } else {
        this.error = '';
      }

      const body = {
        _id: this.auth.subscriber._id,
        company: this.company,
        description: this.description,
        logo: this.logo
      };
      const opts = { headers: { authorization: this.auth.accessToken } };
      this.status === 'saving';

      let res;
      try {
        res = await api.post(`/api/updateSubscriber`, body, opts).then(res => res.data.subscriber);
      } catch (err) {
        vanillatoasts.create({
          title: `HTTP ${err.response.status}: ${err.response.data ? err.response.data.message : 'No response'}`,
          icon: '/images/red-x.svg',
          timeout: 8000,
          positionClass: 'bottomRight'
        });
        return
      }

      this.company = res.companyName;
      this.description = res.description;
      this.logo = res.logo;
      this.name = res.githubUsername;

      this.status = 'saved';

      vanillatoasts.create({
        title: 'Company Profile Updated!',
        icon: '/images/check-green.svg',
        timeout: 8000,
        positionClass: 'bottomRight'
      });
    }
  }
});