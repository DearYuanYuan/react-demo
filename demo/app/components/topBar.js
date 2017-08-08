import React from 'react';
export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="topBarUsr clearfix">
                <ul>
                    <li>设置</li>
                    <li>登陆</li>
                    <li>注册</li>
                </ul>
                 
            </div>
        )
    }
}