angular.module('salesBotApp')
  .controller('RegisterController', ['$scope', '$location', 'ApiService', 'AuthService', function($scope, $location, ApiService, AuthService) {
    $scope.email = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.businessName = '';
    $scope.error = '';
    $scope.loading = false;

    $scope.handleSubmit = function() {
      $scope.error = '';

      if ($scope.password !== $scope.confirmPassword) {
        $scope.error = 'Passwords do not match';
        return;
      }

      $scope.loading = true;

      ApiService.register($scope.email, $scope.password, $scope.businessName)
        .then(function(response) {
          AuthService.login(response.user, response.token);
          $location.path('/dashboard');
        })
        .catch(function(error) {
          $scope.error = error.data?.error || 'Registration failed';
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    $scope.navigateToLogin = function() {
      $location.path('/login');
    };
  }]);
