import React from 'react';
import $ from 'jquery';

import Login from "./Login"
import { BrowserRouter, Router, Route, Match, HashRouter, Link,IndexLink,hashHistory } from 'react-router-dom'
/* 首页 */
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNav:0,
        }
    }
    handleChangeRouter(key){
        this.setState({
            activeNav:key
        })
    }
    getActiveNavKey() {
        //导航栏的key列表
        const keyList = ["deal", "account"]
        for (var i = 0; i < keyList.length; i++) {
            if (window.location.hash.indexOf(keyList[i]) != -1) { //如果地址栏路径中包含这个key
                this.setState({
                    activeNav:i
                })
            }
        }
    }
    //组件将要移除时
    componentWillUnmount() {
    }

    componentWillMount(){
    }
    componentDidMount() {
        this.getActiveNavKey()
    }

    // 渲染页面
    render() {

        return (
            <aside className="nav-aside" >
                <ul className="navBar" >
                    <li className={this.state.activeNav==0?'active-nav':''} >
                        <Link to="/deal">
                            <p className="nav-list" onClick={this.handleChangeRouter.bind(this,0)}>
                                <i className="fa fa-list fa-2x block"></i> 交易记录
                            </p>
                        </Link>
                    </li>
                    <li className={this.state.activeNav==1?'active-nav':''} >
                        <Link to="/account">

                            <p className="nav-list" onClick={this.handleChangeRouter.bind(this,1)}> <i className="fa fa-user fa-2x block"></i>账户</p>
                        </Link>
                    </li>
                </ul>
            </aside>
        )
    }
}
