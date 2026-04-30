angular.module('salesBotApp', ['ngRoute', 'ngAnimate'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/src/templates/landing.html',
        controller: 'LandingController'
      })
      .when('/login', {
        templateUrl: '/src/templates/login.html',
        controller: 'LoginController'
      })
      .when('/register', {
        templateUrl: '/src/templates/register.html',
        controller: 'RegisterController'
      })
      .when('/dashboard', {
        templateUrl: '/src/templates/dashboard.html',
        controller: 'DashboardController',
        resolve: {
          auth: ['AuthService', function(AuthService) {
            return AuthService.requireLogin();
          }]
        }
      })
      .when('/business-profile', {
        templateUrl: '/src/templates/business-profile.html',
        controller: 'BusinessProfileController',
        resolve: {
          auth: ['AuthService', function(AuthService) {
            return AuthService.requireLogin();
          }]
        }
      })
      .when('/widget-metrics', {
        templateUrl: '/src/templates/widget-metrics.html',
        controller: 'WidgetMetricsController',
        resolve: {
          auth: ['AuthService', function(AuthService) {
            return AuthService.requireLogin();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    // Check if user is logged in on app start
    AuthService.init();
    
    // Handle route change errors
    $rootScope.$on('$routeChangeError', function() {
      $location.path('/login');
    });
  }]);
