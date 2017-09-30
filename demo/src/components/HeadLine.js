
import React from "react";
import $ from 'jquery';


/* 首页 */
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    //组件将要移除时
    componentWillUnmount() {
    }

    componentWillMount(){
    }
    componentDidMount() {
    }

    // 渲染页面
    render() {

        return (
            <header className="clearfix">
                <img src="../static/img/logo.svg" alt="" className="logo-8lab"/>
                <ul className="userSetting">
                    <li><img src="../static/img/Avatar.png" alt=""/></li>
                    <li>{this.props.userName}</li>
                    <li className="sign-out font-yellow" onClick={this.props.logout.bind(this)}>注销 <i className="fa fa-sign-out font-yellow fa-lg"></i></li>
                </ul>
            </header>
        )
    }
}




