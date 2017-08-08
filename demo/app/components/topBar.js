import React from 'react';
export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="topBarUsr clearfix" style={{marginLeft:!this.props.collapsed?'-103px':'-64px'}}>
                <ul className="clearfix">
                    <li>你好，yuanyuan！</li>
                    <li className="usr-icon-img"></li>
                </ul>
                 
            </div>
        )
    }
}