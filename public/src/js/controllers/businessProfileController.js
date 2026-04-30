angular.module('salesBotApp')
  .controller('BusinessProfileController', ['$scope', '$location', 'ApiService', 'AuthService', function($scope, $location, ApiService, AuthService) {
    $scope.user = AuthService.getUser();
    $scope.profile = {
      company_name: '',
      industry: '',
      website: '',
      phone: '',
      address: '',
      description: '',
      logo_url: ''
    };
    $scope.loading = true;
    $scope.saving = false;
    $scope.success = '';
    $scope.error = '';

    $scope.init = function() {
      $scope.fetchBusinessProfile();
    };

    $scope.fetchBusinessProfile = function() {
      ApiService.getBusinessProfile()
        .then(function(response) {
          if (response.profile) {
            $scope.profile = response.profile;
          } else {
            $scope.profile.company_name = $scope.user.company_name || '';
          }
          $scope.loading = false;
        })
        .catch(function(error) {
          console.error(error);
          $scope.error = 'Failed to load business profile';
          $scope.loading = false;
        });
    };

    $scope.handleChange = function(field, value) {
      $scope.profile[field] = value;
    };

    $scope.handleSubmit = function() {
      $scope.saving = true;
      $scope.error = '';
      $scope.success = '';

      ApiService.updateBusinessProfile($scope.profile)
        .then(function(response) {
          $scope.profile = response.profile;
          $scope.success = 'Business profile saved successfully!';
          setTimeout(function() {
            $scope.$apply(function() {
              $scope.success = '';
            });
          }, 3000);
        })
        .catch(function(error) {
          $scope.error = error.data?.error || 'Failed to save business profile';
        })
        .finally(function() {
          $scope.saving = false;
        });
    };

    $scope.handleBack = function() {
      $location.path('/dashboard');
    };

    $scope.init();
  }]);
