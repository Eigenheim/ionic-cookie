angular.module('Cookies.controllers', ['Cookies.services'])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('HomeCtrl', function($scope, $rootScope, $state) {
  $scope.goToPhoto = function() {
    $state.go('photo');
  }
})

.controller('PhotoCtrl', function($scope, $rootScope, $state, $http, Camera, env) {

  // initialize
  if($rootScope.lastPhoto != undefined) {
    $scope.photoTaken = true;
    $scope.lastPhoto = $rootScope.lastPhoto;

    $scope.cropLeft = 0;
    $scope.cropTop = 0;
    $scope.cropWidth = 80;
    $scope.cropHeight = 120;
  } else {
    $scope.photoTaken = false;
    $scope.lastPhoto = "";

    $scope.cropLeft = 0;
    $scope.cropTop = 0;
    $scope.cropWidth = 80;
    $scope.cropHeight = 120;
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
    // send event and redirect first
    $rootScope.$broadcast('event:image:process');
    $state.go('preview');

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
      ctx.drawImage(this,0,0);
      var dataUrl = canvas.toDataURL("image/png");

      $http({
        url: env.apiEndpoint + "/contour",
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data: {
          "image": dataUrl.replace(/^data:image\/(png|jpg);base64,/, ""),
          "preserveCorners":true
        }
      })
      .then(function(resp) {
        // success
        if(resp.data.status === "ok") {
          $rootScope.uuid = resp.uuid;
          $rootScope.$broadcast('event:image:result', { status: 'ok', payload: resp.data.payload });
      } else {
          $rootScope.$broadcast('event:image:result', { status: 'error', msg: resp.msg });
        }

      }, function(resp) {
        // error
        $rootScope.$broadcast('event:image:result', { status: 'error', msg: resp.status + ", " + resp.statusText });
      });
    }

    img.src = $scope.lastPhoto;
  }
})

.controller('PreviewCtrl', function($scope, $rootScope, $state, ErrorHandler) {
  // initialize
  $scope.loading = true;

  $scope.$on('event:image:process', function(event, data) {
    ErrorHandler.hide();
    $scope.loading = true;
  });

  $scope.$on('event:image:result', function(event, data) {
    console.log(data);

    if(data.status === "ok") {
      var process = function(x, y) {
        if(x.length != y.length) {
          return null;
        } else {
          return x.map(function(e, i) {
            return {'x': e, 'y': y[i]}
          })
        }
      }

      $scope.data = {
        'points': process(data.payload.x, data.payload.y),
        'width': data.payload.xsize,
        'height': data.payload.ysize,
        'offsetX': data.payload.minimalx,
        'offsetY': data.payload.minimaly
      };

      $scope.loading = false;
    } else {
      ErrorHandler.show("Es ist leider ein Fehler passiert");
    }
  })
})
