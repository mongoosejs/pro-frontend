module.exports = [
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/job-board',
    name: 'job-board',
    requireLogin: true
  },
  {
    path: '/profile',
    name: 'profile',
    requireLogin: true
  },
  {
    path: '/team',
    name: 'team',
    requireLogin: true
  },
  {
    path: '/oauth-callback',
    name: 'oauth-callback'
  }
];