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
import Files = require('./files');
import Profiles = require('./profiles');
import Profile = require('./profile');
import Blocks = require('./blocks');

export function init(profiles: Profiles) {
    generate(profiles);
    setInterval(function() { generate(profiles); }, 1200000);
}

function generate(profiles: Profiles) {
    console.log("Generating sandbox...");
    var profile: Profile = createSandboxProfile();
    profiles.writeUnchecked(profile).then(function() {
        console.log("sandbox successfully initialized.")
    }).fail(function(err) {
        console.error(err);
    }).done();
}

function createSandboxProfile(): Profile {
    var sandbox: Profile = Profiles.generateEmptyProfile("sandbox", "");
    sandbox.page.blocks.push(Blocks.links(1, 0, "Awesome sites", [{
            title: "Homeblocks",
            url: "http://www.homeblocks.net/#v/sandbox",
            description: "Build your homepage, block after block! Feel free to edit the sandbox (no password), or create a new profile."
        },{
            title: "Homeblocks/jotak",
            url: "http://www.homeblocks.net/#/v/jotak",
            description: "Example: @jotak's homepage"
        },{
            title: "Homeblocks@GitHub",
            url: "https://github.com/jotak/homeblocks",
            description: "Check me out on github!"
        }]));
    return sandbox;
}
