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
import q = require("q");
import fs = require('fs');

"use strict";

class Files {
    private root: string;

    constructor(root: string) {
        console.log("File system initialized with root " + root);
        this.root = root;
    }

    public mkDir(dir: string): q.Promise<boolean> {
        var deferred: q.Deferred<boolean> = q.defer<boolean>();
        fs.mkdir(this.root + dir, function(e) {
            if (!e) {
                deferred.resolve(true);
            } else if (e.code === 'EEXIST') {
                deferred.resolve(false);
            } else {
                deferred.reject(e);
            }
        });
        return deferred.promise;
    }

    public read(relativePath: string): q.Promise<string> {
        var deferred: q.Deferred<string> = q.defer<string>();
        fs.readFile(this.root + relativePath, {encoding: "utf8"}, function(err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    public write(relativePath: string, content: string): q.Promise<boolean> {
        var deferred: q.Deferred<boolean> = q.defer<boolean>();
        fs.writeFile(this.root + relativePath, content, function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(true);
            }
        });
        return deferred.promise;
    }
}
export = Files
