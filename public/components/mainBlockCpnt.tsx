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
/// <reference path="../../typings/react/react-global.d.ts" />

"use strict";

class MainBlockProps {
    public sharedZone: SharedZone;
    public username: string;
}

interface MainBlockState {
    description: string;
    showNew: boolean;
    showEdit: boolean;
    showDuplicate: boolean;
    showUpload: boolean;
}

class MainBlockCpnt extends React.Component<MainBlockProps, any> {

    constructor(props: MainBlockProps) {
        super(props);
        var state: MainBlockState = {
            description: "",
            showNew: false,
            showEdit: false,
            showDuplicate: false,
            showUpload: false
        };
        this.state = state;
        props.sharedZone.register(this.setMessage, this);
    }

    setMessage(msg: string) {
        this.setState({description: msg});
    }

    private mouseOver(description) {
        var self = this;
        return function() {
            self.props.sharedZone.display(description);
        }
    }

    private clickNew() {
        this.setState({showNew: !this.state.showNew});
    }

    private clickEdit() {
        this.setState({showEdit: !this.state.showEdit});
    }

    private clickDuplicate() {
        this.setState({showDuplicate: !this.state.showDuplicate});
    }

    private clickUpload() {
        this.setState({showUpload: !this.state.showUpload});
    }

    render() {
        return (<div>
            <a onClick={this.clickNew} onMouseOver={this.mouseOver("Create a new profile")}><i className="fa fa-file-o"></i></a>{'\u00A0'}
            <a onClick={this.clickEdit} onMouseOver={this.mouseOver("Switch to edit mode")}><i className="fa fa-pencil-square-o"></i></a>{'\u00A0'}
            <a onClick={this.clickDuplicate} onMouseOver={this.mouseOver("Duplicate this profile")}><i className="fa fa-files-o"></i></a>{'\u00A0'}
            <a onClick={this.clickUpload} onMouseOver={this.mouseOver("Upload profile from json")}><i className="fa fa-cloud-upload"></i></a>
            <br/><br/>
            <div>{this.state.description || "Welcome " + this.props.username + "!"}</div>
        </div>);
    }
}
/*            <div className={this.state.showNew ? "" : "hidden"}>
                <input id='newName' type='text' placeholder='Name' ng-model='newName' press-enter="onNew(newName, newPwd);"><br/>
                <input type='password' placeholder='Password' ng-model='newPwd' press-enter="onNew(newName, newPwd);"><br/>
                <input type='button' value='Ok' onClick={this.onNew(newName, newPwd)}>
            </div>
            <div className={this.state.showEdit ? "" : "hidden"}>
                <input id='editPwd' type='password' placeholder='Password' ng-model='pwd' press-enter="editMode(pwd);"><br/>
                <input type='button' value='Ok' onClick={this.editMode(pwd)}>
            </div>
            <div className={this.state.showDuplicate ? "" : "hidden"}>
                <input id='dupName' type='text' placeholder='Name' ng-model='dupName'><br/>
                <input type='password' placeholder='Password' ng-model='dupPwd' press-enter="onDuplicate(dupName, dupPwd);"><br/>
                <input type='button' value='Ok' onClick={this.onDuplicate(dupName, dupPwd)}>
            </div>
            <div className={this.state.showUpload ? "" : "hidden"}>
                <textarea ng-model='uploadProfile'></textarea><br/>
                <input type='button' value='Ok' onClick={this.onUpload(uploadProfile)}>
            </div>
*/
