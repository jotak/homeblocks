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
import q = require("q");
import fs = require('fs');
import Profile = require('./profile');

"use strict";

class Profiles {

    private static path(username: string): string {
        return "profiles/" + username + ".json";
    }

    static load(username: string): q.Promise<Profile> {
        var deferred: q.Deferred<Profile> = q.defer<Profile>();
        fs.readFile(Profiles.path(username), {encoding: "utf8"}, function(err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                var jsonContent: Profile = eval('(' + data + ')');
                deferred.resolve(jsonContent);
            }
        });
        return deferred.promise;
    }

    static save(username: string, profile: Profile): q.Promise<string> {
        var deferred: q.Deferred<string> = q.defer<string>();
        fs.writeFile(Profiles.path(username), JSON.stringify(profile), function(err) {
            if (err) {
                deferred.reject(new Error(err.code));
            } else {
                deferred.resolve("OK");
            }
        });
        return deferred.promise;
    }

    static generateEmptyProfile(username: string): Profile {
        return {
            username: username,
            hashedPass: "",
            page: {
                mainBlock: {
                    posx: 0,
                    posy: 0
                },
                blocks: []
            }
        }
    }
}
export = Profiles
