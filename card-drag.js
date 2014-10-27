var app = angular.module('demo', ['ionic']);

app.directive('noScroll', function($document) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

var CardView = ionic.views.View.inherit({
  initialize: function(opts) {
    // Store the card element
    this.el = opts.el;
    this.$el = $(this.el);
    this.startX = this.startY = this.x = this.y = 0;
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    ionic.onGesture('dragstart', function(e) {
      // Process start of drag
      console.log(e);
      self._doDragStart(e);
    }, this.el);

    ionic.onGesture('drag', function(e) {
      // Process drag
      ionic.requestAnimationFrame(function() { self._doDrag(e) });
      console.log(e);
    }, this.el);

    ionic.onGesture('dragend', function(e) {
      // Process end of drag
      console.log(e);
    }, this.el);
  },

  _doDragStart: function(e) {
    this.windowHeight = $(window).height();
    console.log(this.windowHeight);
    this.tween = new TimelineMax();
    this.tween.to(
      $(this.el), 1, {
        css:{transform:"translateY(" + this.windowHeight + "px)", opacity: 0}
    });
    this.tween.stop();
  },

  _doDrag: function(e) {
    this.tween.play()
    return
    // Calculate how far we've dragged, with a slow-down effect
    var o = e.gesture.deltaY / 3;

    // Get the angle of rotation based on the
    // drag distance and our distance from the
    // center of the card (computed in dragstart),
    // and the side of the card we are dragging from
    this.rotationAngle = Math.atan(o/this.touchDistance) * this.rotationDirection;

    // Don't rotate if dragging up
    if(e.gesture.deltaY < 0) {
      this.rotationAngle = 0;
    }

    // Update the y position of this view
    this.y = this.startY + (e.gesture.deltaY * 0.4);

    // Apply the CSS transformation to the card,
    // translating it up or down, and rotating
    // it based on the computed angle
    this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px, ' + this.y  + 'px, 0) rotate(' + (this.rotationAngle || 0) + 'rad)';
  }
});

app.directive('card', function() {
  return {
    restrict: 'E',
    template: "<div class='card' ng-transclude></div>",
    replace: true,
    transclude: true,
    scope: { onSwipe: '&' },
    compile: function(element, attr) {
      return function($scope, $element, $attr, swipeCards) {
        var el = $element[0];

        // Instantiate our card view
        var card = new CardView({
          el: el,
          onSwipe: function() {
            $timeout(function() {
              $scope.onSwipe();
            });
          }
        });
      }
    }
  }
});
