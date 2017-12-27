
import React from "react";
import $ from 'jquery';

import LoadingAction from './ActionLoading.js'
/* 首页 */
export default class TransAssets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userListSelect:false,
            userTransName:'',
            userListKey:'',
            userTransList:false, //模糊查询的用户列表
        }
    }


    /*
     * 资产类型点击
     * */
    handleSelectContent(e){
        // console.log($(e.target))
        this.setState({
            userTransName: $(e.target).text(),
            userListSelect:false,
            userListKey:$(e.target).attr('name')
        })

    }
    /*
     * 点击资产类型下拉框
     * */
    handleShowAssetType(){
        this.setState({
            userListSelect:!this.state.userListSelect
        })
    }
    handleWriteName(e){
        this.setState({
            userTransName:$(e.target).val(),
            userListSelect:true,
        })
        var nameList = [];
        this.props.userTransList.map((list,index)=>{
            nameList.push({
                username:list.username,
                id:list.id,
                department:list.department
            })
        })
        if($(e.target).val()==''){
            this.setState({
                userTransList:nameList,
            })
        }else{
            // todo 用户名模糊查询
            var len = nameList.length;
            var arr = [];
            var keyWord = $(e.target).val();
            for(var i=0;i<len;i++){
                //如果字符串中不包含目标字符会返回-1
                if(nameList[i].username.indexOf(keyWord)>=0){
                    arr.push(nameList[i]);
                }
            }
            // console.log(arr)
            this.setState({
                userTransList:arr,
            })
        }
    }
    //组件将要移除时
    componentWillUnmount() {
    }

    componentWillMount(){
        //生成用户列表，以匹配模糊查询
        var nameList = [];
        this.props.userTransList.map((list,index)=>{
            nameList.push({
                username:list.username,
                id:list.id,
                department:list.department
            })
        })
        this.setState({
            userTransList:nameList,
        })
    }
    componentDidMount() {
    }

    // 渲染页面
    render() {

        return (
            <div className="detailHistoryCover">
                <div className="showDealTransHistrty clearfix addOrTransAssets">
                    <h4>资产转移
                        <a href="javascript:void(0)" onClick={this.props.closeThisComponent.bind(this)}> <i className="fa fa-close font-yellow"></i></a></h4>
                    <h5>资产所有者：{this.props.dealTransOwner}</h5>
                    <div className="addOrTransAssets-params">
                        <p>转移到目标用户</p>
                        <i className="fa fa-user fa-lg font-yellow assetsIcon-user"></i>
                        <input type="text" className="common-ipt assetsIcon-ipt transAssetsUsr"
                               onChange={this.handleWriteName.bind(this)}
                               value={this.state.userTransName?this.state.userTransName:''} title={this.state.userListKey}/>
                        <i className="fa fa-angle-down fa-lg font-yellow assetsIcon-select" onClick={this.handleShowAssetType.bind(this)}></i>
                        {
                            this.state.userListSelect &&
                            <div className="getIptList"
                            onClick={this.handleSelectContent.bind(this)}>
                            {(this.state.userTransList || this.props.userTransList).map(function(data,index){
                                return(
                                    <h6 key={index} name={data.id}>{data.username}</h6>
                                )
                            })}
                            </div>
                        }
                    </div>
                    <div className="addOrTransAssets-params">
                        <p>资产类型</p>
                        <i className="fa fa-list-ul fa-lg font-yellow assetsIcon-user"></i>
                        <input type="text" className="common-ipt assetsIcon-ipt" value={this.props.dealTransType} readOnly/>
                    </div>
                    <div className="addOrTransAssets-params">
                        <p>资产内容</p>
                        <p className="transContent">{this.props.dealTransAsset}</p>
                    </div>
                    <div className="addOrTransAssets-params">
                        <p>附件</p>
                        <p className="transContent">{this.props.dealTransFile}</p>
                    </div>
                    <p className="transBtnGaps">
                        <button className="common-btn cancel-btn gaps" onClick={this.props.closeThisComponent.bind(this)}>取消</button>
                        <button className="common-btn confirm-btn" onClick={this.props.confirmTransAssets.bind(this)}>确认</button>
                    </p>
                    <p className="errorMsg">{this.props.conformMsg}</p>
                    {
                        this.props.showLoadingAction &&
                        <LoadingAction/>
                    }
                </div>
            </div>
        )
    }
}




