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

// Declare app level module which depends on views, and components
angular.module('linkage', [
    'ngRoute',
    'ngSanitize',
    'linkage.mainview',
    'linkage.editview'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/v/sandbox'});
}]);

function initListeners($scope, $location, $http) {
    $scope.viewMode = function() {
        $location.path("/v/" + $scope.username);
    };
    $scope.editMode = function() {
        $location.path("/e/" + $scope.username);
    };
    $scope.onDuplicate = function(newName) {
        $scope.profile.username = newName;
        saveProfile($http, newName, $scope.profile);
        $location.path("/v/" + newName);
    };
    initEditListeners($scope, $http);
}

function computePositions(blocks) {
    var map = {};
    // First pass: fill map
    for (var i in blocks) {
        var block = blocks[i];
        map[block.posx + "," + block.posy] = block;
    }
    // Second pass: extract information
    for (var i in blocks) {
        var block = blocks[i];
        block.N = map[block.posx + "," + (block.posy-1)] !== undefined;
        block.S = map[block.posx + "," + (block.posy+1)] !== undefined;
        block.E = map[(block.posx+1) + "," + block.posy] !== undefined;
        block.W = map[(block.posx-1) + "," + block.posy] !== undefined;
    }
}

function findBlockByPosition(blocks, x, y) {
    for (var i in blocks) {
        var block = blocks[i];
        if (block.posx == x && block.posy == y) {
            return block;
        }
    }
    return null;
}

function saveProfile($http, username, profile) {
    $http.post('/api/' + username, {profile: profile})
        .success(function(response) {
            console.log("Profile has been saved: " + response);
        })
        .error(function(data) {
            console.error('Error: ' + data);
            profile.message = 'Error: ' + data;
        });
}
