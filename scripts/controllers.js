angular.module('Cookies.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('HomeCtrl', function($scope, $state) {
  $scope.gotoPhoto = function() {
    $state.go('photo');
  }
})

.controller('PhotoCtrl', function($scope, $rootScope, $timeout, Camera) {
  if($rootScope.lastPhoto != undefined) {
    $scope.photoTaken = true;
    $scope.lastPhoto = $rootScope.lastPhoto;
  } else {
    $scope.photoTaken = false;
    $scope.lastPhoto = "";
  }

  $scope.getPhoto = function() {
    console.log('Getting camera');
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $rootScope.lastPhoto = imageURI;
      $scope.lastPhoto = imageURI;
      $scope.photoTaken = true;
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
