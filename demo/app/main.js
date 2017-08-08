//main.js
import React from 'react';
import { render } from "react-dom";
import { Menu, Icon, Button } from 'antd';
import Component from './components/component.js';
import Home from './components/home.js';
import './styles/common.less'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import HeadLine from './components/headLine.js'
import Echarts from './components/echarts.js'
import Input from './components/input.js'
import Buttons from './components/button.js'
import TopBar from './components/topBar.js'
browserHistory.push('/home'); //页面首次加载时，进入主页
export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
  
    }
    toggleCollapsed(){
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    componentDidMount(){
    }
    handleToggleNav(){

    }
    render(){
        return (
            <div className="container clearfix">
                <HeadLine collapsed={this.state.collapsed} toggleCollapsed={this.toggleCollapsed.bind(this)}></HeadLine>
                <div className="content" style={{marginLeft:!this.state.collapsed?'103px':'64px'}}>
                     <TopBar></TopBar>
                    {this.props.children}
                </div>
                
            </div>
        )
    }
}
render((
    <Router history={browserHistory}>
     <Route path="/" component={App}>
       <Route path="/home" component={Home} />
       <Route path="/echarts" component={Echarts} />
       <Route path="/input" component={Input} />
       <Route path="/button" component={Buttons} />
       <Route path="/component" component={Component} />
    </Route>
   </Router>
), document.getElementById('app'));


