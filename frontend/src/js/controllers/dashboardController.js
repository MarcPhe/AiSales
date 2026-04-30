angular.module('salesBotApp')
  .controller('DashboardController', ['$scope', '$location', '$interval', 'ApiService', 'AuthService', function($scope, $location, $interval, ApiService, AuthService) {
    $scope.user = AuthService.getUser();
    $scope.communications = [];
    $scope.selectedCommunication = null;
    $scope.messages = [];
    $scope.loading = true;
    $scope.error = '';
    $scope.showChat = false;
    $scope.businessProfile = null;
    $scope.showEmbedCode = false;
    $scope.copiedEmbed = false;
    $scope.mobileMenuOpen = false;

    // Initialize
    $scope.init = function() {
      $scope.fetchCommunications();
      $scope.fetchBusinessProfile();
      
      // Refresh communications every 5 seconds
      const interval = $interval($scope.fetchCommunications, 5000);
      $scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });
    };

    $scope.fetchCommunications = function() {
      ApiService.getConversations(50, 0)
        .then(function(response) {
          $scope.communications = response.communications || [];
          $scope.error = '';
        })
        .catch(function(error) {
          $scope.error = 'Failed to load communications';
          console.error(error);
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    $scope.fetchBusinessProfile = function() {
      ApiService.getBusinessProfile()
        .then(function(response) {
          $scope.businessProfile = response.profile;
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.fetchCommunicationDetails = function(id) {
      // Fetch details for selected communication
      // This would need a service method to implement
    };

    $scope.handleSelectCommunication = function(id) {
      $scope.fetchCommunicationDetails(id);
      $scope.showChat = false;
    };

    $scope.handleChatToggle = function() {
      $scope.showChat = !$scope.showChat;
      $scope.showEmbedCode = false;
    };

    $scope.handleEmbedToggle = function() {
      $scope.showEmbedCode = !$scope.showEmbedCode;
      $scope.showChat = false;
    };

    $scope.generateEmbedCode = function() {
      return `<!-- AI Sales Bot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:3001/embed.js?userId=${$scope.user.id}';
    document.head.appendChild(script);
  })();
</script>`;
    };

    $scope.handleCopyEmbed = function() {
      const code = $scope.generateEmbedCode();
      navigator.clipboard.writeText(code).then(function() {
        $scope.copiedEmbed = true;
        setTimeout(function() {
          $scope.$apply(function() {
            $scope.copiedEmbed = false;
          });
        }, 2000);
      });
    };

    $scope.handleShowBusinessProfile = function() {
      $location.path('/business-profile');
      $scope.mobileMenuOpen = false;
    };

    $scope.handleShowMetrics = function() {
      $location.path('/widget-metrics');
      $scope.mobileMenuOpen = false;
    };

    $scope.handleLogout = function() {
      AuthService.logout();
    };

    $scope.toggleMobileMenu = function() {
      $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
    };

    $scope.closeMobileMenu = function() {
      $scope.mobileMenuOpen = false;
    };

    // Initialize controller
    $scope.init();
  }]);
