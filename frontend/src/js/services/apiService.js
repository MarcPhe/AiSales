angular.module('salesBotApp')
  .factory('ApiService', ['$http', 'AuthService', function($http, AuthService) {
    const API_BASE_URL = '/api';

    const service = {
      login: function(email, password) {
        return $http.post(`${API_BASE_URL}/auth/login`, {
          email: email,
          password: password
        }).then(function(response) {
          return response.data;
        });
      },

      register: function(email, password, businessName) {
        return $http.post(`${API_BASE_URL}/auth/register`, {
          email: email,
          password: password,
          businessName: businessName
        }).then(function(response) {
          return response.data;
        });
      },

      updateBusinessProfile: function(profileData) {
        const token = AuthService.getToken();
        return $http.post(`${API_BASE_URL}/business/profile`, profileData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      },

      getWidgetMetrics: function() {
        const token = AuthService.getToken();
        return $http.get(`${API_BASE_URL}/widget-metrics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      },

      getConversations: function(limit, offset) {
        const token = AuthService.getToken();
        return $http.get(`${API_BASE_URL}/conversations?limit=${limit}&offset=${offset}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      },

      getEmbedCode: function() {
        const token = AuthService.getToken();
        return $http.get(`${API_BASE_URL}/embed-code`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      },

      getBusinessProfile: function() {
        const token = AuthService.getToken();
        return $http.get(`${API_BASE_URL}/business/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      },

      getWidgetMetricsTimeseries: function() {
        const token = AuthService.getToken();
        return $http.get(`${API_BASE_URL}/widget-metrics-timeseries`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(function(response) {
          return response.data;
        });
      }
    };

    return service;
  }]);
