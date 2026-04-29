angular.module('salesBotApp')
  .controller('LoginController', ['$scope', '$location', 'ApiService', 'AuthService', function($scope, $location, ApiService, AuthService) {
    $scope.email = '';
    $scope.password = '';
    $scope.error = '';
    $scope.loading = false;

    $scope.handleSubmit = function() {
      $scope.error = '';
      $scope.loading = true;

      ApiService.login($scope.email, $scope.password)
        .then(function(response) {
          AuthService.login(response.user, response.token);
          $location.path('/dashboard');
        })
        .catch(function(error) {
          $scope.error = error.data?.error || 'Login failed';
        })
        .finally(function() {
          $scope.loading = false;
        });
    };
  }]);
