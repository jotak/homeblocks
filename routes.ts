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
import express = require('express');
import crypto = require('crypto');
import Profile = require('./profile');
import Profiles = require('./profiles');

var tokens: { [username: string]: string } = {};

export function register(app: express.Application, profiles: Profiles) {

    app.post("/api/auth", function(req, res) {
        profiles.matchPassword(req.body.username, req.body.password).then(function() {
            // Generate token
            tokens[req.body.username] = genToken();
            console.log("Token generated for " + req.body.username + ": " + tokens[req.body.username]);
            res.send(tokens[req.body.username]);
        }).fail(function(reason: Error) {
            res.status(400).send(reason.message);
        }).done();
    });

    // GET PROFILE
    app.get("/api/profile/:username", function(req, res) {
        profiles.load(req.params.username).then(function(profile: Profile) {
            profile.password = "";
            res.json(profile);
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            res.json(Profiles.generateEmptyProfile(req.params.username, ""));
        }).done();
    });

    // GET PROFILE BLOCK NAMES
    app.get("/api/profile/:username/blocknames", function(req, res) {
        profiles.load(req.params.username).then(function(profile: Profile) {
            var names: string[] = profile.page.blocks.map(function(block: Block) {
                return block.title != undefined ? block.title : "?";
            });
            res.json(names);
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            res.json([]);
        }).done();
    });

    // GET PROFILE BLOCK
    app.get("/api/profile/:username/block/:idx", function(req, res) {
        profiles.load(req.params.username).then(function(profile: Profile) {
            if (profile.page.blocks.length > req.params.idx) {
                res.json(profile.page.blocks[req.params.idx]);
            } else {
                res.json(null);
            }
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            res.json(null);
        }).done();
    });

    // CREATE
    app.put("/api/profile", function(req, res) {
        if (!checkUsername(req.body.username)) {
            res.status(400).send("Invalid user name");
            return;
        }
        profiles.create(req.body.username, req.body.password).then(function() {
            // Generate token
            tokens[req.body.username] = genToken();
            console.log("Token generated for " + req.body.username + ": " + tokens[req.body.username]);
            res.send(tokens[req.body.username]);
        }).fail(function(reason: Error) {
            console.log("Application error: " + reason.message);
            res.status(500).send(String(reason));
        }).done();
    });

    // UPDATE
    app.post("/api/profile", function(req, res) {
        if (!checkUsername(req.body.profile.username)) {
            res.status(400).send("Invalid user name");
            return;
        }
        if (!req.body.token || tokens[req.body.profile.username] != req.body.token) {
            res.status(400).send("You must login first");
            return;
        }
        profiles.update(req.body.profile).then(function(status: boolean) {
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

function genToken(): string {
    return crypto.randomBytes(48).toString('hex');
}
