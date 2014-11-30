angular.module('Cookies.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('HomeCtrl', function($scope, $rootScope, $state) {
  $scope.gotoPhoto = function() {
    $state.go('photo');
  }
})

.controller('PhotoCtrl', function($scope, $rootScope, $state, $http, Camera) {

  // initialize
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

  $scope.processPhoto = function() {
    var img = new Image(),
      canvas = document.createElement("canvas"),
      left = $scope.cropLeft,
      top =  $scope.cropTop,
      width = $scope.cropWidth,
      height = $scope.cropHeight;

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      var dataUrl = canvas.toDataURL("image/png");

      console.log(dataUrl.replace(/^data:image\/(png|jpg);base64,/, ""));

      $http({
        url: 'request-url',
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data: { 'img' : dataUrl.replace(/^data:image\/(png|jpg);base64,/, "") }
      })
      .then(function(resp) {
        // success
        if(resp.status == 'ok') {
          $rootScope.uuid = resp.uuid;
          $rootScope.$broadcast('event:incoming:data', { status: 'ok', polygon: resp.polygon });
        } else {
          $rootScope.$broadcast('event:incoming:data', {status: 'error', msg: resp.msg});
        }

      }, function(resp) {
        // error
        $rootScope.$broadcast('event:incoming:data', {status: 'error', msg: resp.status + ", " + resp.statusText});
      });
    }

    img.src = $scope.lastPhoto;
    $state.go('preview');
  }
})

.controller('PreviewCtrl', function($scope, $rootScope, $state) {
  $scope.$on('event:incoming:data', function(event, data) {
    console.log(data);
  })
})
