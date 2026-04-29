angular.module('salesBotApp')
  .controller('WidgetMetricsController', ['$scope', '$location', '$q', 'ApiService', function($scope, $location, $q, ApiService) {
    $scope.metrics = null;
    $scope.timeseries = [];
    $scope.loading = true;
    $scope.error = '';

    $scope.init = function() {
      $scope.fetchMetrics();
    };

    $scope.fetchMetrics = function() {
      $scope.loading = true;
      $scope.error = '';

      // Fetch both metrics and timeseries in parallel
      $q.all([
        ApiService.getWidgetMetrics(),
        ApiService.getWidgetMetricsTimeseries()
      ])
        .then(function(responses) {
          $scope.metrics = responses[0];
          $scope.timeseries = responses[1];
        })
        .catch(function(error) {
          $scope.error = 'Failed to load metrics';
          console.error(error);
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    $scope.handleBack = function() {
      $location.path('/dashboard');
    };

    $scope.init();
  }]);
