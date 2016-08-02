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

interface BlockStyleData {
    marginLeft: number;
    marginTop: number;
    color: string;
    dx: number;
    dy: number;
}

class FrontLink {
    public editing: boolean;
}

class FrontBlock {
    public static WIDTH: number = 200;
    public static HEIGHT: number = 200;
    public static HALF_WIDTH: number = FrontBlock.WIDTH / 2;
    public static HALF_HEIGHT: number = FrontBlock.HEIGHT / 2;

    public id: number;
    public posx: number;
    public posy: number;
    public style: string;
    public N: boolean;
    public S: boolean;
    public E: boolean;
    public W: boolean;
    public NStyle: string;
    public SStyle: string;
    public EStyle: string;
    public WStyle: string;
    styleData: BlockStyleData;
    public links: FrontLink[];
    public type: string;

    // Edition flags / temporary front-end (angular) data
    public editTitle: boolean;
    public fromProfile: string;
    public fromBlocks: string[];
    public selected: number;
}
