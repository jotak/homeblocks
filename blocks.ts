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

class Blocks {

    static main(posx: number, posy: number): MainBlock {
        return {
            posx: posx,
            posy: posy,
            type: "main"
        }
    }

    static links(posx: number, posy: number, title: string, links: Link[]): LinksBlock {
        return {
            posx: posx,
            posy: posy,
            title: title,
            type: "links",
            links: links
        }
    }

    static audio(posx: number, posy: number, title: string, links: Link[]): AudioBlock {
        return {
            posx: posx,
            posy: posy,
            title: title,
            type: "audio",
            links: links
        }
    }

    static video(posx: number, posy: number, title: string, links: Link[]): VideoBlock {
        return {
            posx: posx,
            posy: posy,
            title: title,
            type: "video",
            links: links
        }
    }

    static clone(block: Block) {
        if (block.type == "main") {
            return Blocks.main(block.posx, block.posy);
        } else if (block.type == "links") {
            var linksBlock: LinksBlock = <LinksBlock>block;
            return Blocks.links(block.posx, block.posy, block.title, linksBlock.links.map(function(link) {
                return Blocks.copyLink(link)
            }));
        } else if (block.type == "audio") {
            var audioBlock: AudioBlock = <AudioBlock>block;
            return Blocks.audio(block.posx, block.posy, block.title, audioBlock.links.map(function(link) {
                return Blocks.copyLink(link)
            }));
        } else if (block.type == "video") {
            var videoBlock: VideoBlock = <VideoBlock>block;
            return Blocks.video(block.posx, block.posy, block.title, videoBlock.links.map(function(link) {
                return Blocks.copyLink(link)
            }));
        }
    }

    private static copyLink(link: Link): Link {
        // Eliminate any unnecessary field
        return {
            title: link.title,
            url: link.url,
            description: link.description
        };
    }
}
export = Blocks
