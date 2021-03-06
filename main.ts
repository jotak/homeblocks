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
import bodyParser = require('body-parser');
import routes = require('./routes');
import Profiles = require('./profiles');
import Files = require('./files');
import Sandbox = require('./sandbox-generator');

"use strict";

// Init web server
var port: Number = (process.env.PORT || 5000);
var app: express.Application = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
let profiles: Profiles = new Profiles(new Files(""));
Sandbox.init(profiles);
routes.register(app, profiles);
app.listen(port);

console.log("It's " + new Date().toString() + ", application listens on " + port);
