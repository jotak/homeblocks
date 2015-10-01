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

class BlockProps {
    public block: FrontBlock;
    public isEdit: boolean;
    public sharedZone: SharedZone;
}

class BlockCpnt extends React.Component<BlockProps, any> {

    constructor(props: BlockProps) {
        super(props);
    }

    private getBlockContent(block: FrontBlock) {
        switch (block.type) {
            case "main": return <MainBlockCpnt sharedZone={this.props.sharedZone} username="Toto"/>;
            case "links": return <LinkBlockCpnt links={block.links} sharedZone={this.props.sharedZone}/>;
            default: return undefined;
        }
    }

    render() {
        var block = this.props.block;
        return (<div className="block" style={block.style}>
            {block.title ? (<div className="block-title">{block.title}</div>) : undefined}
            {this.getBlockContent(block)}
        </div>);
    }
}
