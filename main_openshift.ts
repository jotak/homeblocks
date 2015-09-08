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
import express = require('express');
import bodyParser = require('body-parser');
import routes = require('./routes');

"use strict";

/**
 *  Define the sample application.
 */
class Server {

    private ipaddress: string;
    private port: number;
    private zcache: any;
    private app: express.Application;

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    private setupVariables() {
        //  Set the environment variables we need.
        this.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        this.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof this.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            this.ipaddress = "127.0.0.1";
        };
    }

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    private terminator(sig?: string) {
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...', new Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', new Date(Date.now()));
    }

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    private setupTerminationHandlers() {
        //  Process on exit and signals.
        var self: Server = this;
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    }


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    private initializeServer() {
        this.app = express();
        this.app.use(express.static(__dirname + '/public'));
        this.app.use(bodyParser.json());
        routes.register(this.app);
    }

    /**
     *  Initializes the sample application.
     */
    public initialize() {
        this.setupVariables();
        this.setupTerminationHandlers();

        // Create the express server and routes.
        this.initializeServer();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    public start() {
        //  Start the app on the specific interface (and port).
        var self = this;
        this.app.listen(this.port, this.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        new Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var zapp = new Server();
zapp.initialize();
zapp.start();
