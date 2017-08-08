//main.js
import React from 'react';
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;
import {Link,browserHistory} from 'react-router';
export default class Headline extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current:'home'
        }
  
    }
    
    handleToggleNavTab(e){
        browserHistory.push(e.key) //路由跳转到当前key
         this.setState({
            current:e.key
        });
        // console.log(e.key)
    }
    handleToggleNav(){

    }
    render(){
        return (
                <div className="left-navBar">
                    <Button type="primary nav-toggle-hide" onClick={this.props.toggleCollapsed.bind(this)} style={{ marginBottom: 16 }}>
                        <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>
                    <Menu onClick={this.handleToggleNavTab.bind(this)}
                        defaultSelectedKeys={['home']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={this.props.collapsed}
                        selectedKeys={[this.state.current]}
                    >
                        <Menu.Item key="home">
                            <Icon type="pie-chart" />
                            <span>home</span>
                        </Menu.Item>
                        <Menu.Item key="echarts">
                            <Icon type="desktop" />
                            <span>echarts</span>
                        </Menu.Item>
                        <Menu.Item key="input">
                            <Icon type="inbox" />
                            <span>input</span>
                        </Menu.Item>
                        <Menu.Item key="table">
                            <Icon type="inbox" />
                            <span>table</span>
                        </Menu.Item>
                        <Menu.Item key="tips">
                            <Icon type="inbox" />
                            <span>提示框</span>
                        </Menu.Item>
                        <Menu.Item key="animate">
                            <Icon type="inbox" />
                            <span>animate</span>
                        </Menu.Item>
                    </Menu> 
                </div>
        )
    }
}