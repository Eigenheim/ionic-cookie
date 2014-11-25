angular.module('Cookies.directives', [])


.directive('backgroundImage', function() {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      $element[0].style.backgroundImage = 'url(' + $attr.src + ')';
      $element[0].style.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + 'px';
      $element[0].style.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + 'px';
    }
  }
})
