/*
The MIT License (MIT)
Copyright (c) 2015 Joel Takvorian, https://github.com/jotak/homeblocks
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use strict";

/*
angular.module('homeblocks.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/v/:username', {
        templateUrl: 'mainview.html',
        controller: 'mainViewCtrl'
    });
}]).controller("mainViewCtrl", ['$scope','$http','$routeParams','$rootScope','$location', function($scope, $http, $routeParams, $rootScope, $location) {
    $rootScope.title = $routeParams.username + "@homeblocks";
    $http.get('/api/profile/' + $routeParams.username)
        .success(function(profile) {
            $scope.profile = profile;
            $scope.username = $routeParams.username;
            $scope.blocks = profile.page.blocks;
            $scope.minPos = { x: 0, y: 0};
            fillPageStyle($scope.blocks, $scope.minPos);
            initMainListeners($scope, $location, $http);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]).directive("pressEnter", function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    }
}).directive('trustedUrl', function($sce) {
    return {
        restrict: 'A',
        scope: {
            src:'='
        },
        replace: true,
        template: function(element, attrs, scope) {
            return '<' + attrs.type + ' ng-src="{{ url }}" controls></' + attrs.type + '>';
        },
        link: function(scope: any) {
            scope.$watch('src', function(newVal, oldVal) {
               if (newVal !== undefined) {
                   scope.url = $sce.trustAsResourceUrl(newVal);
               }
            });
        }
    };
});

function initMainListeners($scope, $location, $http) {
    $scope.editMode = function(password) {
        $scope.token = "";
        $http.post('/api/auth', { username: $scope.username, password: password })
            .success(function(token) {
                $location.path("/e/" + $scope.username + "/" + token);
            })
            .error(function(err) {
                console.error('Error: ' + err);
                $scope.profile.message = 'Error: ' + err;
            });
    };
    $scope.onNew = function(username, password) {
        $http.put('/api/profile', { username: username, password: password })
            .success(function(token) {
                $location.path("/e/" + username + "/" + token);
            })
            .error(function(err) {
                console.error(err);
                $scope.profile.message = err;
            });
    };
    $scope.onDuplicate = function(username, password) {
        $http.put('/api/profile', { username: username, password: password })
            .success(function(token) {
                $scope.profile.username = username;
                $scope.profile.password = password;
                saveProfile($http, token, $scope.profile).then(function() {
                    $location.path("/v/" + username);
                }).fail(function(err) {
                    console.error(err);
                    $scope.profile.message = err;
                }).done();
                $scope.profile.password = "";
            })
            .error(function(err) {
                console.error(err);
                $scope.profile.message = err;
            });
    };
    $scope.onUpload = function(uploaded) {
        $scope.profile = eval('(' + uploaded + ')');
        $http.put('/api/profile', { username: $scope.profile.username, password: $scope.profile.password })
            .success(function(token) {
                saveProfile($http, token, $scope.profile).then(function() {
                    $location.path("/v/" + $scope.profile.username);
                }).fail(function(err) {
                    console.error(err);
                    $scope.profile.message = err;
                }).done();
                $scope.profile.password = "";
            })
            .error(function(err) {
                console.error(err);
                $scope.profile.message = err;
            });
    };
    $scope.onClickNew = function() {
        $scope.showNew = !$scope.showNew;
        setTimeout(function() {
            document.getElementById('newName').focus();
        }, 30);
    };
    $scope.onClickEdit = function() {
        $scope.showEdit = !$scope.showEdit;
        setTimeout(function() {
            document.getElementById('editPwd').focus();
        }, 30);
    };
    $scope.onClickDuplicate = function() {
        $scope.showDuplicate = !$scope.showDuplicate;
        setTimeout(function() {
            document.getElementById('dupName').focus();
        }, 30);
    };
}
*/
