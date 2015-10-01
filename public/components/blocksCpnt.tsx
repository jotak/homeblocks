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
/// <reference path="../../typings/react/react-global.d.ts" />

"use strict";

class BlocksProps {
    public blocks: FrontBlock[];
    public isEdit: boolean;
}

interface DisplayCallback {
    f: (msg: string) => void;
    ctx: any;
}

class SharedZone {
    private callbacks: DisplayCallback[] = [];

    public register(clbk: (msg: string) => void, context: any) {
        this.callbacks.push({f: clbk, ctx: context});
    }

    public display(msg) {
        this.callbacks.forEach(function(clbk) {
            clbk.f.call(clbk.ctx, msg);
        });
    }
}

class BlocksCpnt extends React.Component<BlocksProps, any> {

    private sharedZone: SharedZone = new SharedZone();

    constructor(props: BlocksProps) {
        super(props);
    }

    render() {
        var self = this;
        return <div>{self.props.blocks.map(function(block) {
            return <BlockCpnt block={block} isEdit={self.props.isEdit} sharedZone={self.sharedZone}/>;
        })}</div>
    }
}
