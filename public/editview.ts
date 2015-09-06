/*
The MIT License (MIT)
Copyright (c) 2014 Joel Takvorian, https://github.com/jotak/mipod
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

angular.module('linkage.editview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/w/:username', {
        templateUrl: 'editview.html',
        controller: 'editViewCtrl'
    });
}])
.controller("editViewCtrl", ['$scope','$http','$routeParams','$rootScope','$location', function($scope, $http, $routeParams, $rootScope, $location) {
    $rootScope.title = "Linkage - " + $routeParams.username;
    $http.get('/api/' + $routeParams.username)
        .success(function(profile) {
            $scope.page = profile.page;
            $scope.username = $routeParams.username;
            fillPageStyle($scope.page);
            $scope.page.selectedBlock = -1;
            initListeners($scope, $location, $routeParams.username);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]);

function initEditListeners($scope) {
    $scope.onClickBlock = function(id) {
        if ($scope.page.selectedBlock === id) {
            $scope.page.selectedBlock = -1;
        } else {
            $scope.page.selectedBlock = id;
        }
    }

    $scope.onSaveLink = function(link) {
        link.editing = false;
    }

    $scope.onCreateLink = function(block) {
        var link = {
            title: "",
            url: "",
            description: "",
            editing: true
        };
        block.links.push(link);
    }

    $scope.onDeleteLink = function(block, link) {
        var index = block.links.indexOf(link);
        if (index >= 0) {
            block.links.splice(index, 1);
        }
    }
}
