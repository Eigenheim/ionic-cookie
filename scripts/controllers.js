angular.module('Cookies.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('HomeCtrl', function($scope, $state, Camera) {
  $scope.getPhoto = function() {
    console.log('Getting camera');
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
      $state.go('photo', {url: encodeURIComponent(imageURI)});
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  }
})

.controller('PhotoCtrl', function($scope, $stateParams, $state) {
  // Get photo from camera
  $scope.lastPhoto = decodeURIComponent($stateParams.url);




})
