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

angular.module('linkage.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/v/:username', {
        templateUrl: 'mainview.html',
        controller: 'mainViewCtrl'
    });
}])
.controller("mainViewCtrl", ['$scope','$http','$routeParams','$rootScope','$location', function($scope, $http, $routeParams, $rootScope, $location) {
    $rootScope.title = "Linkage - " + $routeParams.username;
    $http.get('/api/profile/' + $routeParams.username)
        .success(function(profile) {
            $scope.profile = profile;
            $scope.username = $routeParams.username;
            $scope.blocks = [profile.page.mainBlock].concat(profile.page.blocks);
            fillPageStyle($scope.blocks);
            initListeners($scope, $location, $http);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]);

function fillPageStyle(blocks) {
    computePositions(blocks);
    var id = 0;
    for (var i in blocks) {
        fillBlockStyle(blocks[i], id++);
    }
}

function fillBlockStyle(block, id) {
    var marginLeft = -100 + block.posx * 200;
    var marginTop = -100 + block.posy * 200;
    var color = ((block.posx + block.posy) % 2) ? "#34495e" : "#020202";
    block.style = "margin-left: " + marginLeft + "px; margin-top: " + marginTop + "px; background-color: " + color;
    block.NStyle = "margin-left: " + (marginLeft+100) + "px; margin-top: " + marginTop + "px;";
    block.SStyle = "margin-left: " + (marginLeft+100) + "px; margin-top: " + (marginTop+200) + "px;";
    block.EStyle = "margin-left: " + (marginLeft+200) + "px; margin-top: " + (marginTop+100) + "px;";
    block.WStyle = "margin-left: " + marginLeft + "px; margin-top: " + (marginTop+100) + "px;";
    block.id = id;
}
