angular.module('salesBotApp')
  .factory('AuthService', ['$q', '$location', function($q, $location) {
    const service = {
      user: null,
      token: null,

      init: function() {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          this.user = JSON.parse(storedUser);
          this.token = storedToken;
        }
      },

      login: function(userData, token) {
        this.user = userData;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
      },

      logout: function() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        $location.path('/');
      },

      isLoggedIn: function() {
        return this.token !== null && this.user !== null;
      },

      getToken: function() {
        return this.token;
      },

      getUser: function() {
        return this.user;
      },

      requireLogin: function() {
        if (this.isLoggedIn()) {
          return $q.when(this.user);
        } else {
          $location.path('/login');
          return $q.reject('Not logged in');
        }
      }
    };

    service.init();
    return service;
  }]);
