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
/// <reference path="../typings/react/react-global.d.ts" />

"use strict";

var blocks: FrontBlock[] = JSON.parse(
    "[{\"posx\":-3,\"posy\":-1,\"type\":\"main\",\"N\":false,\"S\":false,\"E\":false,\"W\":false,\"style\":"
            + "{\"marginLeft\": \"-700px\", \"marginTop\": \"-300px\", \"backgroundColor\": \"#020202\"},"
            + "\"NStyle\":\"margin-left: -600px; margin-top: -300px;\",\"SStyle\":\"margin-left: -600px; margin-top: -100px;\",\"EStyle\":\"margin-left: -500px; margin-top: -200px;\",\"WStyle\":\"margin-left: -700px; margin-top: -200px;\",\"id\":0},"
     + "{\"posx\":-1,\"posy\":0,\"title\":\"Google\",\"type\":\"links\",\"links\":[{\"title\":\"GMail\",\"url\":\"https://mail.google.com/mail/#inbox\",\"description\":\"\"},{\"title\":\"GCal\",\"url\":\"https://www.google.com/calendar/\",\"description\":\"\"},{\"title\":\"GDrive\",\"url\":\"https://drive.google.com/\",\"description\":\"\"},{\"title\":\"Hangouts\",\"url\":\"https://plus.google.com/hangouts\",\"description\":\"toto\"}],\"N\":true,\"S\":true,\"E\":false,\"W\":false,\"style\":"
            + "{\"marginLeft\": \"-300px\", \"marginTop\": \"-100px\", \"backgroundColor\": \"#34495e\"},"
            + "\"NStyle\":\"margin-left: -200px; margin-top: -100px;\",\"SStyle\":\"margin-left: -200px; margin-top: 100px;\",\"EStyle\":\"margin-left: -100px; margin-top: 0px;\",\"WStyle\":\"margin-left: -300px; margin-top: 0px;\",\"id\":1}]"
);

class ViewModeProps {
    public blocks: FrontBlock[];
}

class ViewMode extends React.Component<ViewModeProps, any> {

    constructor(props: ViewModeProps) {
        super(props);
    }

    render() {
        return <BlocksCpnt blocks={this.props.blocks} isEdit={false} />;
    }
}

React.render(<ViewMode blocks={blocks} />, document.getElementById('app'));
