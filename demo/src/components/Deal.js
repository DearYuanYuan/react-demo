import React from 'react';
import $ from 'jquery';
/* 首页 */
export default class Deal extends React.Component {
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
            <aside className="deal" >
                <p>deal</p>
            </aside>
        )
    }
}
