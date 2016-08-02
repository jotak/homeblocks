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

interface vector1d {
    t0: number;
    dt: number;
}

interface vector1dAbs {
    t0: number;
    t1: number;
}

class IntDiv {
    public q: number;
    public r: number;
    public static divide(n: number, d: number): IntDiv {
        var result = new IntDiv();
        result.q = Math.floor(n / d);
        if (n >= 0) {
            result.r = n % d;
        } else {
            result.r = (n % d) + d;
        }
        return result;
    }
}

class Transition {
    private static MS_STEP: number = 50;
    private hUpdate = null;
    private vectors: vector1dAbs[];
    constructor(private ctx: any, startPos: number[], private clbk: (ctx: any, pos: number[]) => void) {
        this.vectors = startPos.map(p => { return { t0: p, t1: p }; });
    }
    public updateVectors(destPos: number[]) {
        for (var i = 0; i < this.vectors.length; i++) {
            this.vectors[i].t1 = destPos[i];
        }
        if (this.hUpdate == null) {
            var self = this;
            this.hUpdate = setInterval(function() {
                self.update();
            }, Transition.MS_STEP);
        }
    }
    private update() {
        this.vectors.forEach(v => {
            if (v.t1 > v.t0) {
                v.t0 += 20;
                if (v.t0 > v.t1) {
                    v.t0 = v.t1;
                }
            } else {
                v.t0 -= 20;
                if (v.t0 < v.t1) {
                    v.t0 = v.t1;
                }
            }
        });
        this.clbk(this.ctx, this.vectors.map(v => {
            return v.t0;
        }));
        if (this.vectors.filter(v => { return v.t0 != v.t1; }).length == 0) {
            // All done
            clearInterval(this.hUpdate);
            this.hUpdate = null;
        }
    }
}

class DragNDrop {

    private static currentInstance: DragNDrop = null;
    private static styleComputer: (FrontBlock) => string;

    private xInit: number;
    private yInit: number;
    private xGridOffset: number;
    private yGridOffset: number;
    private transition: Transition;

    constructor(event: any, private block: FrontBlock, private domElt: any) {
        this.xInit = event.clientX;
        this.yInit = event.clientY;
        this.xGridOffset = IntDiv.divide(block.styleData.marginLeft, FrontBlock.WIDTH).r;
        this.yGridOffset = IntDiv.divide(block.styleData.marginTop, FrontBlock.HEIGHT).r;
        this.transition = new Transition(this, [0, 0], this.transitionCallback);
        DragNDrop.currentInstance = this;
        event.preventDefault();
    }

    public static register($document, $scope, styleComputer: (FrontBlock) => string) {
        $document.bind("mousemove", function(event) {
            if (DragNDrop.currentInstance) {
                event.preventDefault();
                DragNDrop.currentInstance.onMouseMove(event);
            }
        });
        $document.bind("mouseup", function(event) {
            if (DragNDrop.currentInstance) {
                event.preventDefault();
                DragNDrop.currentInstance.onMouseUp(event);
                DragNDrop.currentInstance = null;
            }
        });
        DragNDrop.styleComputer = styleComputer;
    }

    private onMouseMove(event) {
        var standardDx: number = event.clientX - this.xInit;
        var standardDy: number = event.clientY - this.yInit;
        var vx: vector1d = this.distanceFromAxis(
            this.block.styleData.marginLeft + standardDx - this.xGridOffset,
            FrontBlock.WIDTH
        );
        var vy: vector1d = this.distanceFromAxis(
            this.block.styleData.marginTop + standardDy - this.yGridOffset,
            FrontBlock.HEIGHT
        );
        // TODO: standardDx - vx.dt/2 ?
        this.transition.updateVectors([
            standardDx,
            standardDy
        ]);
    }

    private onMouseUp(event) {
        this.transition.updateVectors([0, 0]);
    }

    // Gives result in [0, size/2]
    private distanceFromAxis(pos: number, size: number): vector1d {
        var frac = IntDiv.divide(pos, size);
        var delta = (frac.r <= size/2) ? frac.r : frac.r - size;
        var iAxis = (frac.r <= size/2) ? frac.q : frac.q + 1;
        return {
            t0: size * iAxis,
            dt: delta
        };
    }

    private transitionCallback(ctx: any, pos: number[]): void {
        ctx.block.styleData.dx = pos[0];
        ctx.block.styleData.dy = pos[1];
        ctx.domElt.style = DragNDrop.styleComputer(ctx.block);
    }
}
