'use strict';

const axios = require('axios');

const client = axios.create({
  baseURL: __BASE_URL
});

module.exports = client;