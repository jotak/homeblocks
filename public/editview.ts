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

angular.module('homeblocks.editview', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/e/:username/:token', {
        templateUrl: 'editview.html',
        controller: 'editViewCtrl'
    });
}])
.controller("editViewCtrl", ['$scope','$http','$routeParams','$rootScope','$location','$document', function($scope, $http, $routeParams, $rootScope, $location, $document) {
    $rootScope.title = $routeParams.username + "@homeblocks";
    $http.get('/api/profile/' + $routeParams.username)
        .success(function(profile) {
            $scope.profile = profile;
            $scope.username = $routeParams.username;
            $scope.token = $routeParams.token;
            $scope.blocks = profile.page.blocks;
            $scope.minPos = { x: 0, y: 0};
            fillPageStyle($scope.blocks, $scope.minPos);
            initEditListeners($scope, $location, $http, $document);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]).directive("dragNDrop", function() {
    return function(scope, element, attrs) {
        element.bind("mousedown", function (event) {
            new DragNDrop(event, scope.block, element[0]);
        });
    };
});

function initEditListeners($scope, $location, $http, $document) {
    $scope.viewMode = function() {
        $scope.token = "";
        $location.path("/v/" + $scope.username);
    };

    $scope.onClickBlockTitle = function(block: FrontBlock, focusId) {
        block.editTitle = true;
        setTimeout(function() {
            document.getElementById(focusId).focus();
        }, 30);
    };

    $scope.onClickLink = function(link: FrontLink, focusId) {
        link.editing = true;
        setTimeout(function() {
            document.getElementById(focusId).focus();
        }, 30);
    };

    $scope.onSaveLink = function(link: FrontLink) {
        link.editing = false;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onCreateLink = function(block: FrontBlock) {
        var link = {
            title: "",
            url: "http://",
            description: "",
            editing: true
        };
        block.links.push(link);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onDeleteLink = function(block: FrontBlock, index) {
        block.links.splice(index, 1);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onLinkUp = function(block: FrontBlock, index) {
        var tmp = block.links[index-1];
        block.links[index-1] = block.links[index];
        block.links[index] = tmp;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onSaveBlock = function(block: FrontBlock) {
        block.editTitle = false;
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onCreateBlock = function(x: number, y: number, type: string) {
        var block = createEmptyBlock(x, y, type);
        if (block != null) {
            $scope.blocks.push(block);
            fillPageStyle($scope.blocks, $scope.minPos);
            saveProfile($http, $scope.token, $scope.profile);
        }
    };

    $scope.onCreateCopyBlock = function(x: number, y: number) {
        $scope.blocks.push({
            posx: x,
            posy: y,
            type: "copy"
        });
        fillPageStyle($scope.blocks, $scope.minPos);
    };

    $scope.onSwapBlocks = function(b1: FrontBlock, b2x: number, b2y: number) {
        var b2 = findBlockByPosition($scope.blocks, b2x, b2y);
        b2.posx = b1.posx;
        b2.posy = b1.posy;
        b1.posx = b2x;
        b1.posy = b2y;
        fillPageStyle($scope.blocks, $scope.minPos);
        saveProfile($http, $scope.token, $scope.profile);
    };

    $scope.onDeleteBlock = function(block: FrontBlock) {
        var index = $scope.blocks.indexOf(block);
        if (index >= 0) {
            $scope.blocks.splice(index, 1);
            fillPageStyle($scope.blocks, $scope.minPos);
            saveProfile($http, $scope.token, $scope.profile);
        }
    };

    $scope.onSearchBlocks = function(block: FrontBlock) {
        $http.get('/api/profile/' + block.fromProfile + "/blocknames")
            .success(function(blockNames) {
                block.fromBlocks = blockNames;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.onCopyBlock = function(block: FrontBlock) {
        $http.get('/api/profile/' + block.fromProfile + "/block/" + block.selected)
            .success(function(fromBlock) {
                fromBlock.posx = block.posx;
                fromBlock.posy = block.posy;
                var index = $scope.blocks.indexOf(block);
                $scope.blocks[index] = fromBlock;
                fillPageStyle($scope.blocks, $scope.minPos);
                saveProfile($http, $scope.token, $scope.profile);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    DragNDrop.register($document, $scope, computeBlockStyle);
}

function createEmptyBlock(x: number, y: number, type: string): FrontBlock {
    var block: FrontBlock = new FrontBlock();
    block.posx = x;
    block.posy = y;
    block.type = type;
    if (type == "links" || type == "audio" || type == "video") {
        block.links = [];
    } else {
        console.log("Type " + type + " not implemented (yet?)");
        return null;
    }
    return block;
}
