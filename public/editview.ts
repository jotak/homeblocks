/*
The MIT License (MIT)
Copyright (c) 2015 Joel Takvorian, https://github.com/jotak/linkage
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
    $routeProvider.when('/e/:username/:token', {
        templateUrl: 'editview.html',
        controller: 'editViewCtrl'
    });
}])
.controller("editViewCtrl", ['$scope','$http','$routeParams','$rootScope','$location', function($scope, $http, $routeParams, $rootScope, $location) {
    $rootScope.title = "Linkage - " + $routeParams.username;
    $http.get('/api/profile/' + $routeParams.username)
        .success(function(profile) {
            $scope.profile = profile;
            $scope.username = $routeParams.username;
            $scope.token = $routeParams.token;
            $scope.blocks = [profile.page.mainBlock].concat(profile.page.blocks);
            fillPageStyle($scope.blocks);
            initEditListeners($scope, $location, $http);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]);

function initEditListeners($scope, $location, $http) {
    $scope.viewMode = function() {
        $scope.token = "";
        $location.path("/v/" + $scope.username);
    };

    $scope.onSaveLink = function(link) {
        link.editing = false;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onCreateLink = function(block) {
        var link = {
            title: "",
            url: "",
            description: "",
            editing: true
        };
        block.links.push(link);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onDeleteLink = function(block, index) {
        block.links.splice(index, 1);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onLinkUp = function(block, index) {
        var tmp = block.links[index-1];
        block.links[index-1] = block.links[index];
        block.links[index] = tmp;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onSaveBlock = function(block) {
        block.editTitle = false;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onCreateBlock = function(x, y) {
        var block = {
            links: [],
            posx: x,
            posy: y
        };
        $scope.profile.page.blocks.push(block);
        $scope.blocks.push(block);
        fillPageStyle($scope.blocks);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onSwapBlocks = function(b1, b2x, b2y) {
        var b2 = findBlockByPosition($scope.blocks, b2x, b2y);
        b2.posx = b1.posx;
        b2.posy = b1.posy;
        b1.posx = b2x;
        b1.posy = b2y;
        fillPageStyle($scope.blocks);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onDeleteBlock = function(block) {
        var index = $scope.profile.page.blocks.indexOf(block);
        if (index >= 0) {
            $scope.profile.page.blocks.splice(index, 1);
            $scope.blocks.splice(index+1, 1);
            fillPageStyle($scope.blocks);
            saveProfile($http, $scope.token, $scope.profile);
        }
    };
}
