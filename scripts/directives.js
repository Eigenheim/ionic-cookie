angular.module('Cookies.directives', [])


.directive('coBackgroundImage', function() {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      $element[0].style.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + 'px';
      $element[0].style.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + 'px';
      $scope.$watch("lastPhoto", function() {
        $element[0].style.backgroundImage = 'url(' + $scope.lastPhoto + ')';
      });
    }
  }
})

.directive('coResizeFrame', function() {
  return {
    restrict: 'E',
    template:  '<div class="resize-element"></div>',
    replace: true,
    scope: false,
    transclude: false,
    link: function($scope, $element, $attr) {

      var $container,
        event_state = {},
        constrain = false,
        min_width = 60,
        min_height = 60,
        max_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        max_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        resize_canvas = document.createElement('canvas');

       // Init structure
       init = function() {
         $element.wrap('<div class="resize-container"></div>')
         .after('<span class="resize-handle resize-handle-nw"></span>')
         .after('<span class="resize-handle resize-handle-ne"></span>')
         .after('<span class="resize-handle resize-handle-se"></span>')
         .after('<span class="resize-handle resize-handle-sw"></span>');

         $container = angular.element(document.getElementsByClassName('resize-container'));

         // Add events
         angular.element(document.getElementsByClassName('resize-handle')).on('mousedown touchstart', startResize);
         $element.on('mousedown touchstart', startMoving);
       }

       startResize = function(e) {
         e.preventDefault();
         e.stopPropagation();
         saveEventState(e);
         angular.element(document).on('mousemove touchmove', resizing);
         angular.element(document).on('mouseup touchup', endResize);
       };

       endResize = function(e) {
         e.preventDefault();
         angular.element(document).off('mouseup touchend', endResize);
         angular.element(document).off('mousemove touchmove', resizing);
       };

       startMoving = function(e){
         e.preventDefault();
         e.stopPropagation();
         saveEventState(e);
         angular.element(document).on('mousemove touchmove', moving);
         angular.element(document).on('mouseup touchend', endMoving);
       };

       endMoving = function(e){
         e.preventDefault();
         angular.element(document).off('mouseup touchend', endMoving);
         angular.element(document).off('mousemove touchmove', moving);
       };

       saveEventState = function(e){
         // Save the initial event details and container state
         event_state.container_width = $container[0].offsetWidth;
         event_state.container_height = $container[0].offsetHeight;
         event_state.container_left = $container[0].offsetLeft;
         event_state.container_top = $container[0].offsetTop;
         event_state.mouse_x = (e.clientX || e.pageX || e.touches[0].clientX) + 0;
         event_state.mouse_y = (e.clientY || e.pageY || e.touches[0].clientY) + 0;

         // This is a fix for mobile safari
         // For some reason it does not allow a direct copy of the touches property
         if(typeof e.touches !== 'undefined'){
           event_state.touches = [];

           var counter = 0;

           for(touch in e.touches) {
             event_state.touches[counter] = {};
             event_state.touches[counter].clientX = 0+touch.clientX;
             event_state.touches[counter].clientY = 0+touch.clientY;

             counter = counter + 1;
           }
         }
         event_state.evnt = e;
       }

       resizing = function(e) {
         var mouse={},width,height,left,top;
         mouse.x = (e.clientX || e.pageX || e.touches[0].clientX) + 0;
         mouse.y = (e.clientY || e.pageY || e.touches[0].clientY) + 0;

         // Position image differently depending on the corner dragged and constraints
         if(angular.element(event_state.evnt.target).hasClass('resize-handle-se') ){
           width = mouse.x - event_state.container_left;
           height = mouse.y  - event_state.container_top;
           left = event_state.container_left;
           top = event_state.container_top;
         } else if(angular.element(event_state.evnt.target).hasClass('resize-handle-sw') ){
           width = event_state.container_width - (mouse.x - event_state.container_left);
           height = mouse.y  - event_state.container_top;
           left = mouse.x;
           top = event_state.container_top;
         } else if(angular.element(event_state.evnt.target).hasClass('resize-handle-nw') ){
           width = event_state.container_width - (mouse.x - event_state.container_left);
           height = event_state.container_height - (mouse.y - event_state.container_top);
           left = mouse.x;
           top = mouse.y;
         } else if(angular.element(event_state.evnt.target).hasClass('resize-handle-ne') ){
           width = mouse.x - event_state.container_left;
           height = event_state.container_height - (mouse.y - event_state.container_top);
           left = event_state.container_left;
           top = mouse.y;
         }

         if(width > min_width && height > min_height && width < max_width && height < max_height) {
           resize(width, height);

           // Without this Firefox will not re-calculate the the image dimensions until drag end
           $container.css({'position':'absolute','left': left + "px",'top': top + "px"});
         }
       }

       resize = function(width, height) {
         $element[0].style.width = width + "px";
         $element[0].style.height = height + "px";

         // save state to scope
         $scope.cropWidth = width;
         $scope.cropHeight = height;
         $scope.$apply();
       }

       moving = function(e) {
         var  mouse={}, touches, left, top;
         e.preventDefault();
         e.stopPropagation();

         touches = e.touches;
         mouse.x =  (e.clientX || e.pageX || touches[0].clientX) + 0;
         mouse.y = (e.clientY || e.pageY || touches[0].clientY) + 0;

         left = mouse.x - (event_state.mouse_x - event_state.container_left);
         top = mouse.y - (event_state.mouse_y - event_state.container_top);


         $container.css({
           'left': left + "px",
           'top': top + "px"
         });

         //save state to scope
         $scope.cropLeft = left;
         $scope.cropTop = top;
         $scope.$apply();
       }

       init();
    }
  }
})

.directive('coRender', function() {
  return {
    restrict: 'A',
    scope: {
      data: "="
    },
    link: function($scope, $element, $attr) {
      // Scale canvas on load
      var canvas = $element[0];
      canvas.style.width ='100%';
      canvas.style.height='100%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = 0.40 * Math.max(window.innerHeight || 0);

      $scope.$watch('data', function() {
        if($scope.data !== undefined) {
          var width = $scope.data.width;
          var height = $scope.data.height;
          var offsetX = $scope.data.offsetX;
          var offsetY = $scope.data.offsetY;

          var context = canvas.getContext('2d');

          // scale to fit canvas
          var scaleFactorX = (canvas.width - 20)/width;
          var scaleFactorY = (canvas.height - 20)/height;
          context.scale(scaleFactorX, scaleFactorY);

          // draw points
          var points = $scope.data.points;
          context.moveTo(points[points.length - 1].x - offsetX, points[points.length - 1].y - offsetY);
          points.forEach(function(point) {
            context.lineTo(point.x - offsetX, point.y - offsetY);
          });

          // shadow
          context.shadowColor = '#BDBDBD';
          context.shadowBlur = 10;
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 5;

          // stroke
          //context.lineWidth = 2;
          //context.strokeStyle = '#83320A';
          //context.stroke();

          var background = new Image();
          background.onload = function() {
            var pattern = context.createPattern(background,'repeat');
            context.fillStyle = pattern;
            context.fill();
          };

          background.src = 'img/cookie_texture.jpg';
        }
      });
    }
  }
})
