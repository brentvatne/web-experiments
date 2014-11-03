angular.module('exampleApp', ['angularFileUpload']).
  controller('ExampleCtrl', ['$scope', '$upload', ($scope, FileUploader) ->
     $scope.isImage = (file) -> file.type.match(/image.*/)
     $scope.images = []

     $scope.onFileSelect = ($files) ->
       _.each($files, (file, i) ->
        if $scope.isImage(file)
          reader = new FileReader()
          reader.onload = (e) ->
            $scope.$apply ->
              image =
                src: reader.result
                x: 0
                y: 0
              $scope.images.push(image)
          reader.readAsDataURL(file)
       )
  ]).
  directive('boardContent', ->
    restrict: 'E'
    replace: true
    template: """
      <img draggable class="board-content-image" ng-src="{{image.src}}" style="left:{{image.x}}px; top:{{image.y}}px; max-width: 200px;">
    """
    scope:
      image: '='
  ).
  directive('draggable', ($timeout) ->
    restrict: 'A'
    link: (scope, element, attr) ->
      $el = $(element)
      Draggable.create(element,
        type: "top,left"
        onDragEnd: ->
          console.log scope.image
          # Save new co-ordinates
      )
  ).
  directive('droppable', ->
    scope:
      drop: '&'
    link: (scope, element) ->
      el = element[0]
  )
