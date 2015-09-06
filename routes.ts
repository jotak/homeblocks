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
import express = require('express');
import Profile = require('./profile');
import Profiles = require('./profiles');

export function register(app: express.Application) {
    app.get("/api/:username", function(req, res) {
        Profiles.load(req.params.username).then(function(profile: Profile) {
            res.json(profile);
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            console.log("Generating new empty profile");
            res.json(Profiles.generateEmptyProfile(req.params.username))
        }).done();
    });

    app.post("/api/:username", function(req, res) {
        if (!checkUsername(req.params.username)) {
            res.status(400).send("Invalid user name");
            return;
        }
        Profiles.save(req.params.username, req.body.profile).then(function(status: string) {
            res.send(status);
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            res.status(500).send(String(reason));
        }).done();
    });

    app.get("*", function(req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });
}

function checkUsername(username: string): boolean {
    var reg = /^[\w]+$/;
    return reg.test(username);
}
