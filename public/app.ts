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
angular.module('homeblocks', [
    'ngRoute',
    'ngSanitize',
    'homeblocks.mainview',
    'homeblocks.editview'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/v/sandbox'});
}]);

function computePositions(blocks: FrontBlock[]) {
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

function findBlockByPosition(blocks: FrontBlock[], x: number, y: number): FrontBlock {
    for (var i in blocks) {
        var block = blocks[i];
        if (block.posx == x && block.posy == y) {
            return block;
        }
    }
    return null;
}

function saveProfile($http, token, profile) {
    var deferred = Q.defer();
    $http.post('/api/profile', { token: token, profile: profile })
        .success(function(response) {
            deferred.resolve(true);
        })
        .error(function(err) {
            deferred.reject('Error: ' + err);
        });
    return deferred.promise;
}

function fillPageStyle(blocks: FrontBlock[], minPos) {
    computePositions(blocks);
    var id = 0;
    // If minimum positions are negative, some part of the blocks would be hidden => we will shift them
    for (var i in blocks) {
        minPos = checkOutOfScreen(blocks[i], minPos);
    }
    for (var i in blocks) {
        fillBlockStyle(blocks[i], id++, minPos);
    }
}

function checkOutOfScreen(block: FrontBlock, minPos) {
    var marginLeft = -FrontBlock.HALF_WIDTH + block.posx * FrontBlock.WIDTH;
    var marginTop = -FrontBlock.HALF_HEIGHT + block.posy * FrontBlock.HEIGHT;
    // Compute minimum positions
    var x = window.innerWidth / 2 + marginLeft;
    var y = window.innerHeight / 2 + marginTop;
    if (x < minPos.x) {
        minPos.x = x;
    }
    if (y < minPos.y) {
        minPos.y = y;
    }
    return minPos;
}

function fillBlockStyle(block: FrontBlock, id: number, minPos) {
    block.styleData = {
        marginLeft: -minPos.x - FrontBlock.HALF_WIDTH + block.posx * FrontBlock.WIDTH,
        marginTop: -minPos.y - FrontBlock.HALF_HEIGHT + block.posy * FrontBlock.HEIGHT,
        color: ((block.posx + block.posy) % 2) ? "#34495e" : "#020202",
        dx: 0,
        dy: 0
    };
    block.id = id;
    computeBlockStyle(block);
}

function computeBlockStyle(block: FrontBlock): string {
    var marginLeft = block.styleData.marginLeft + block.styleData.dx;
    var marginTop = block.styleData.marginTop + block.styleData.dy;
    block.style = "margin-left: " + marginLeft + "px; margin-top: " + marginTop + "px; background-color: " + block.styleData.color;
    block.NStyle = "margin-left: " + (marginLeft+100) + "px; margin-top: " + marginTop + "px;";
    block.SStyle = "margin-left: " + (marginLeft+100) + "px; margin-top: " + (marginTop+200) + "px;";
    block.EStyle = "margin-left: " + (marginLeft+200) + "px; margin-top: " + (marginTop+100) + "px;";
    block.WStyle = "margin-left: " + marginLeft + "px; margin-top: " + (marginTop+100) + "px;";
    return block.style;
}
