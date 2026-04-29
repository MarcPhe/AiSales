angular.module('salesBotApp')
  .controller('LandingController', ['$scope', '$location', function($scope, $location) {
    $scope.handleBookDemo = function() {
      // Open Calendly in a new tab
      window.open('https://calendly.com/your_username', '_blank');
    };

    $scope.navigateToLogin = function() {
      $location.path('/login');
    };

    $scope.navigateToRegister = function() {
      $location.path('/register');
    };
  }]);
