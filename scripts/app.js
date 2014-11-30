'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Cookies', ['ionic', 'config', 'Cookies.services', 'Cookies.controllers', 'Cookies.directives'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('photo', {
    url: '/photo',
    templateUrl: 'templates/photo.html',
    controller: 'PhotoCtrl'
  })

  .state('preview', {
    url: '/preview',
    templateUrl: 'templates/preview.html',
    controller: 'PreviewCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
