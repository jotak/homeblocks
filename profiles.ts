/*
The MIT License (MIT)
Copyright (c) 2015 Joel Takvorian, https://github.com/jotak/linkage
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
import crypto = require('crypto');
import Files = require('./files');
import Profile = require('./profile');

"use strict";

class Profiles {

    private files: Files;

    constructor(files: Files) {
        this.files = files;
    }

    private static path(username: string): string {
        return "profiles/" + username + ".json";
    }

    public load(username: string): q.Promise<Profile> {
        return this.files.read(Profiles.path(username)).then(function(content: string) {
            var profile: Profile = eval('(' + content + ')');
            return profile;
        });
    }

    public create(username: string, password: string): q.Promise<boolean> {
        var self = this;
        var deferred: q.Deferred<boolean> = q.defer<boolean>();
        self.files.read(Profiles.path(username)).then(function(content) {
            deferred.reject(new Error("Profile " + username + " already exists"));
        }).fail(function(err) {
            if (err.code == "ENOENT") {
                self.hash(password).then(function(hash: string) {
                    var profile: Profile = Profiles.generateEmptyProfile(username, hash);
                    self.files.write(Profiles.path(profile.username), JSON.stringify(Profiles.copyProfile(profile))).then(function() {
                        deferred.resolve(true);
                    })
                }).fail(function(err) {
                    deferred.reject(err);
                }).done();
            } else {
                deferred.reject(err);
            }
        }).done();
        return deferred.promise;
    }

    public update(profile: Profile): q.Promise<boolean> {
        var self = this;
        return self.load(profile.username).then(function(old: Profile) {
            profile.password = old.password;
            return self.files.write(Profiles.path(profile.username), JSON.stringify(Profiles.copyProfile(profile)));
        });
    }

    public matchPassword(username: string, password: string): q.Promise<boolean> {
        var self = this;
        // Match password
        return self.hash(password).then(function(hash: string) {
            return self.load(username).then(function(old: Profile) {
                if (old.password === "") {
                    return true;
                } else {
                    if (hash == old.password) {
                        return true;
                    } else {
                        throw new Error("Authentication failure.");
                    }
                }
            });
        });
    }

    static generateEmptyProfile(username: string, password: string): Profile {
        return {
            username: username,
            password: password,
            page: {
                mainBlock: {
                    posx: 0,
                    posy: 0
                },
                blocks: []
            }
        }
    }

    private static copyProfile(profile: Profile): Profile {
        // Eliminate any unnecessary field
        return {
            username: profile.username,
            password: profile.password,
            page: Profiles.copyPage(profile.page)
        };
    }

    private static copyPage(page: Page): Page {
        // Eliminate any unnecessary field
        return {
            mainBlock: Profiles.copyBlock(page.mainBlock),
            blocks: page.blocks.map(function(block: CustomBlock) {
                return Profiles.copyCustomBlock(block);
            })
        };
    }

    private static copyBlock(block: Block): Block {
        // Eliminate any unnecessary field
        return {
            posx: block.posx,
            posy: block.posy
        };
    }

    private static copyCustomBlock(block: CustomBlock): CustomBlock {
        // Eliminate any unnecessary field
        return {
            posx: block.posx,
            posy: block.posy,
            title: block.title,
            links: block.links.map(function(link: Link) {
                return Profiles.copyLink(link);
            })
        };
    }

    private static copyLink(link: Link): Link {
        // Eliminate any unnecessary field
        return {
            title: link.title,
            url: link.url,
            description: link.description
        };
    }

    private hash(password: string): q.Promise<string> {
        if (password === undefined || password === "") {
            return q.fcall<string>(function() { return ""; });
        }
        return this.getSalt().then(function(salt) {
            return crypto.pbkdf2Sync(password, salt, 30, 1024).toString('hex');
        });
    }

    private getSalt(): q.Promise<string> {
        var self = this;
        var deferred: q.Deferred<string> = q.defer<string>();
        self.files.read("salt").then(function(content) {
            deferred.resolve(content);
        }).fail(function(err) {
            if (err.code == "ENOENT") {
                console.log("Salt not found, generating random salt")
                var salt: string = crypto.randomBytes(48).toString('hex');
                self.files.write("salt", salt).then(function() {
                    deferred.resolve(salt);
                }).fail(function(err) {
                    deferred.reject(new Error("Could not write salt. Persistence disabled."));
                }).done();
            } else {
                deferred.reject(new Error("Could not get salt. Persistence disabled."));
            }
        }).done();
        return deferred.promise;
    }
}
export = Profiles
