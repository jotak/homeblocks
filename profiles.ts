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
import Blocks = require('./blocks');
import mig = require('./migrate');

"use strict";

class Profiles {

    private files: Files;

    constructor(files: Files) {
        var self = this;
        self.files = files;
        self.files.mkDir("profiles").then(function(isCreated: boolean) {
            if (isCreated) {
                console.log("'profiles' folder has been created. Now initializing sandbox...")
                var profile: Profile = Profiles.generateSandbox();
                self.files.write(Profiles.path(profile.username), JSON.stringify(Profiles.copyProfile(profile))).then(function() {
                    console.log("sandbox successfully initialized.")
                }).fail(function(err) {
                    console.error(err);
                }).done();
            }
        }).fail(function(err) {
            console.error(err);
        }).done();
    }

    private static path(username: string): string {
        return "profiles/" + username + ".json";
    }

    public load(username: string): q.Promise<Profile> {
        var self = this;
        return self.files.read(Profiles.path(username)).then(function(content: string) {
            var json: any = eval('(' + content + ')');
            var profile: Profile = mig.migrateProfile(json);
            if (profile != null) {
                // Save it
                console.log("Profile migration for " + username + ". Saving migrated profile.");
                profile = Profiles.copyProfile(profile);
                self.files.write(Profiles.path(profile.username), JSON.stringify(profile));
                return profile;
            }
            return json;
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
                    });
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
                blocks: [Blocks.main(0, 0)]
            }
        }
    }

    static generateSandbox(): Profile {
        var sandbox: Profile = Profiles.generateEmptyProfile("sandbox", "");
        sandbox.page.blocks.push(Blocks.links(1, 0, "Awesome sites", [{
                title: "Linkage",
                url: "http://nodejs-lnkg.rhcloud.com/#v/sandbox",
                description: "Linkage sandbox on OpenShift! Feel free to edit (no password)"
            },{
                title: "Linkage/jotak",
                url: "http://nodejs-lnkg.rhcloud.com/#/v/jotak",
                description: "My own page"
            },{
                title: "Linkage@GitHub",
                url: "https://github.com/jotak/linkage",
                description: "Check me out on github!"
            }]));
        return sandbox;
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
            blocks: page.blocks.map(function(block: Block) {
                return Blocks.clone(block);
            })
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
