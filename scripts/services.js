angular.module('Cookies.services', [])

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.factory('ErrorHandler', function($rootScope, $timeout) {
  return {
    show: function(msg, timeout) {
      console.log(msg);

      $rootScope.error = true;
      $rootScope.errorMsg = msg;

      if(timeout) {
        $timeout(function() {
          $rootScope.error = false;
          $rootScope.errorMsg = "";
        }, timeout);
      }
    },
    hide: function() {
      $rootScope.error = false;
      $rootScope.errorMsg = "";
    }
  }
})
