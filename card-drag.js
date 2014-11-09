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
    this.el = opts.el;
    this.$el = $(this.el);
    this.startX = this.startY = this.x = this.y = 0;
    this.offsetY = this.$el.offset().top;
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    ionic.onGesture('dragstart', function(e) { self._doDragStart(e); }, this.el);
    ionic.onGesture('drag', function(e) { self._doDrag(e); }, this.el);
    ionic.onGesture('dragend', function(e) { self._doDragStop(e); }, this.el);
  },

  _doDragStart: function(e) {
    this.windowHeight = $(window).height();
  },

  _doDrag: function(e) {
    this.y = this.startY + e.gesture.deltaY;
    this.opacity = 1 - (this.y / (this.windowHeight - this.offsetY - 200));

    // Could just change this tween to be on a bezier curve
    TweenMax.to($(this.el), 0.2, {css: {y: this.y, opacity: this.opacity}})
  },

  _doDragStop: function(e) {
    if (this.y >= 350) {
      // Animate it off screen
      TweenMax.to($(this.el), 1, {css: {y: this.windowHeight + 100, opacity: 0, ease: 'easeOut'}})
    } else {
      // Animate it back to the original position
      TweenMax.to($(this.el), 0.5, {css: {y: 0, opacity: 1}, ease: 'Back.easeOut'})
      // Reset the y value of the view
      this.y = 0;
    }
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
      return function($scope, $element, $attr) {
        var el = $element[0];

        // Instantiate our card view
        var card = new CardView({
          el: el,
          onSwipe: function() { $timeout(function() { $scope.onSwipe(); }); }
        });
      }
    }
  }
});
