'use strict';

const appendCSS = require('../appendCSS');
const css = require('./profile.css');
const template = require('./profile.html').default;
const axios = require('axios');
const validator = require('validator');

// appendCSS(css);

module.exports = app => app.component('profile', {
  inject: ['auth'],
  data: function() {
    return {
      company: '',
      description: '',
      logo: '',
      name: '',
      error: ''
    }
  },
  template: template,
  mounted: async function() {
    console.log('this.auth', this.auth)
    this.company = this.auth.user.companyName;
    this.description = this.auth.user.description;
    this.logo = this.auth.user.logo;
    this.name = this.auth.user.githubUsername;
  },
  methods: {
    async updateSub() {
      if(!validator.isURL(this.logo)) {
        this.error = 'Please enter a valid url';
        return;
      } else {
        this.error = '';
      }
      const res = await axios.post(`http://localhost:7071/api/updateSub`, 
      { user: this.auth.user._id, company: this.company, description: this.description, logo: this.logo},
      {headers: { authorization: this.auth.accessToken, 'Content-Type': 'application/json' } });
      console.log('the response', res.data)
      this.company = res.data.companyName;
      this.description = res.data.description;
      this.logo = res.data.logo;
      this.name = res.data.githubUsername;
    }
  }
});