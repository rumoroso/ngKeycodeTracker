var buttonsModule = angular.module('ngKeycodeTracer', [])
    .directive('keycodeTracker', function ($compile, $location, $rootScope) {
        return {
            restrict: 'A',
            controller: function ($scope, $document, $timeout) {
                $scope.keyPressed = false;
                $scope.showTracer = false;

                $document.bind("keypress keydown", function (e) {
                    $scope.keyPressed = true;
                    $scope.keycode = e.shiftKey ? 'shift' : '';
                    $scope.keycode += e.ctrlKey ? 'ctrlKey' : '';
                    $scope.keycode += (e.shiftKey || e.ctrlKey) && e.which ? ' + ' : '';
                    $scope.keycode += e.which;
                    $scope.$apply();
                });

                $document.bind("keyup", function () {
                    $scope.keyPressed = false;
                    $scope.$apply();
                    //$timeout(drawLine, 100);
                });

                function changeView(view) {
                    $location.path(view);
                }

                function drawLine() {
                    var position = elementStyle($document[0].activeElement);

                    $scope.angle = Math.atan(position.left / position.top) * 180 / Math.PI;
                    $scope.height = Math.sqrt(Math.pow(position.left, 2) + Math.pow(position.top, 2));
                    $scope.showTracer = true;

                    $timeout(removeLine, 1000);
                }

                function removeLine() {
                    $scope.showTracer = false;
                    //$scope.height = 0;
                }

                function elementStyle(elem) {
                    return {
                        top: angular.element(elem).offset().top || 0,
                        left: angular.element(elem).offset().left || 0,
                        width: elem.offsetWidth,
                        height: elem.offsetHeight
                    }
                }

            },
            link: function (scope, iElement) {
                var tracerText = $compile(
                        '<div id="keycode-tracer" ng-show="showTracer" style="position: fixed; top: 0; left: 0; height: {{height}}px; border: 1px solid red; width: 1px;transform-origin: 0 0;transform: rotateZ(-{{angle}}deg);"></div>' +
                        '<p class="keycode-info" style="position: fixed; top: 10px; right: 10px; box-shadow: 0 0 3px {{keyPressed ? \', 0 0 20px\' : \'\'}}; padding: 4px; text-align: center;">pressed keycode<span style="display: block; font-weight: bold;" ng-bind="keycode"></span></p>'
                    )(scope);

                iElement.append(tracerText);
            }
        }
    });
