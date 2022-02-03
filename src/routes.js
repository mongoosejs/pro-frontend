module.exports = [
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/job-board',
    name: 'job-board',
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/team',
    name: 'team',
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/oauth-callback',
    name: 'oauth-callback'
  }
];