
import React from "react";
import $ from 'jquery';
import {Pagination} from 'react-bootstrap';
import AddNewAssets from './AddNewAssets.js'
import TransAssets from './TransAssets.js'
import LoadingText from './Loading.js'
import LoadingAction from "./ActionLoading";
import LoginBox from  './LoginBox'

let fetchUrl = 'http://139.196.253.89:8080'
/* 首页 */
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentListPageNum:1, //当前页码
            dataListAllPage:1, //总页码
            addNewAssetsBox:false,//新增资产弹框
            TransAssetsBox:false,//资产转移弹框
            dealListData:false, //交易历史
            getTypeList:[],//资产类型
            conformMsg:'', //错误信息
            userTransList:[], //获取用户的交易详情
            dealTransType:'', //资产转移的类型
            dealTransAsset:'', //资产转移的资产内容
            dealTransTxid:'', //资产转移的资产id
            dealTransFile:'',//资产转移的附件和交易历史的附件
            dealTransOwner:'',//资产拥有者
            showLoadingAction:false, //ajax请求时，loading效果
            searchContent:'',//搜索资产内容--关键字
            errorMsg:'',//错误提示
            loginTimeout:false,//登录超时
            errorMsgBox:'',//资产操作错误提示
        }
    }

    /*
    * 关闭组件
    * */
    closeThisComponent(index) {
        this.setState({
            conformMsg:'', //错误信息
            addNewAssetsBox: false, //增加资产弹框
            TransAssetsBox: false, //转移资产弹框
        })
        //交易历史详情关闭
        $('.single-deal-detail').eq(index).find('div.detailHistoryCover').hide();
    }
    /*
    * 点击单条交易查看交易详情
    * */
    showDealDetailBox(index,id){
        var self  = this;
        $.ajax({
            url: fetchUrl+'/api/chain_trans/query_trans_detail/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data:{
                asset_id:id
            },
            success: function (data) {
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    var historyList = self.state.dealListData;
                    historyList[index].detail = data.detail
                    // console.log(historyList[index])
                    self.setState({
                        dealListData:historyList,
                        errorMsgBox:''
                    })
                }else if (data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }else{
                    var historyList = self.state.dealListData;
                    historyList[index].detail = []
                    // console.log(historyList[index])
                    self.setState({
                        dealListData:historyList,
                        errorMsgBox:data.message
                    })
                }

            },
            error: function () {
                var historyList = self.state.dealListData;
                historyList[index].detail = []
                // console.log(historyList[index])
                self.setState({
                    dealListData:historyList,
                    errorMsgBox:'服务器繁忙，请稍后重试'
                })
            }
        })
        $('.single-deal-detail').eq(index).find('div.detailHistoryCover').show();
    }
    /*
    * 新增资产
    * */
    handleAddNewAssets(){
        this.setState({
            addNewAssetsBox:true
        })
    }
    /*
    * 确认新增资产
    * asset
      type
      file
    * */
    confirmAddAsset(){
        var txType = $('.add-assets-type').attr('title')
        var asset = $('#add-assets-content').val()
        // console.log(asset)
        var formData = new FormData();
        formData.append('type',txType);
        formData.append('asset',asset);
        formData.append('file',$('#uploadFileForm .add-assets-file')[0].files[0]);
        if(txType==''){
            this.setState({
                conformMsg:'请选择资产类型'
            })
        }else if(asset==''&&$('#uploadFileForm .add-assets-file')[0].files[0]==undefined){
            this.setState({
                conformMsg:'请输入资产内容'
            })
        }else{
            // console.log(1)
            var self  = this;
            self.setState({
                showLoadingAction:true,
            })
            $.ajax({
                url: fetchUrl+'/api/chain_trans/create/',
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data:formData,
                error:function(){
                    self.setState({
                        conformMsg:'服务器繁忙，请稍后重试～',
                        showLoadingAction:false,
                    })
                },
                success: function (data) {
                    // console.log(data)
                    if(data.code==200){
                        self.setState({
                            addNewAssetsBox:false,
                            conformMsg:'',
                            showLoadingAction:false,
                        })
                        self.loadDealList();//重新渲染交易列表
                    }else if(data.code==210){
                        self.setState({
                            loginTimeout:true,
                        })
                    }
                    else{
                        self.setState({
                            conformMsg:data.message,
                            showLoadingAction:false,
                        })
                    }
                }
            })
        }
    }
    /*
    * 转移资产
    * type:资产类型
    * asset：资产
    * txid：资产id
    * */
    handleTransAssets(type,asset,txid,file,usrName,e){
        e.stopPropagation()
        this.setState({
            TransAssetsBox:true,
            dealTransType:type,
            dealTransAsset:asset,
            dealTransTxid:txid,
            dealTransFile:file,
            dealTransOwner:usrName,
        })
    }
    /*
    * 确认转移资产
    * tx_id：转移的资产id
    * next_user_id：转移到某个用户的id
    * */
    confirmTransAssets(){
        var transId = $('.transAssetsUsr').attr('title')
        // console.log(this.state.dealTransTxid)
        if($('.transAssetsUsr').val()==''){
            this.setState({
                conformMsg:'请选择要转移的用户'
            })
        }else{
            /**/
            var self = this;
            self.setState({
                showLoadingAction:true,
            })
            $.ajax({
                url: fetchUrl+'/api/chain_trans/transfer/',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data:{
                    tx_id:this.state.dealTransTxid,//资产id
                    next_user_id:transId //传入被转移者的id
                },
                error:function(){
                    self.setState({
                        conformMsg:'服务器繁忙，请稍后重试～',
                        showLoadingAction:false,
                    })
                },
                success: function (data) {
                    // console.log(JSON.stringify(data))
                    if(data.code==200){
                        self.setState({
                            TransAssetsBox:false,
                            showLoadingAction:false,
                        })
                        self.loadDealList()//重新渲染交易列表
                    }else if(data.code==210){
                        self.setState({
                            loginTimeout:true,
                        })

                    }else{
                        self.setState({
                            conformMsg:data.message,
                            showLoadingAction:false,
                        })
                    }
                }
            })

        }

    }

    /*
    * 加载交易列表
    * */
    loadDealList(pageNum,pageSize,searchContent){
        var self = this;
        $.ajax({
            url: fetchUrl+'/api/chain_trans/query_list/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data:{
                page:pageNum,
                page_size:pageSize,
                asset_search:searchContent,
            },
            success:function(data){
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    var pages = parseInt(data.count/10)+((data.count%10)!=0?1:0)
                    self.setState({
                        dealListData:data.data,
                        dataListAllPage:pages,
                    })
                    $('#pageJumpNum').val('')
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }else{
                    self.setState({
                        dealListData:[],
                        dataListAllPage:0,
                        errorMsg:data.message
                    })
                }

            },
            error:function(){
                self.setState({
                    dealListData:[],
                    dataListAllPage:0,
                    errorMsg:'服务器繁忙，请稍后重试～'
                })
            },
        })
    }
    /*
    * 加载资产类型列表
    * */
    loadAssetsTypeList(){
        var self  = this;
        $.ajax({
            url: fetchUrl+'/api/chain_trans/query_tran_types/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (data) {
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    self.setState({
                        getTypeList:data.results,
                    })
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }else{
                    self.setState({
                        getTypeList:[]
                    })
                }
            },
            error:function () {
                self.setState({
                    getTypeList:[]
                })
            }
        })
    }
    /*
    * 加载用户列表
    * */
    loadUsrList(){
        var self  = this;
        $.ajax({
            url: fetchUrl+'/api/chain_user/query_all/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (data) {
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    self.setState({
                        userTransList:data.list
                    })
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }else {
                    self.setState({
                        userTransList:[]
                    })
                }
            },
            error:function(){
                self.setState({
                    userTransList:[]
                })
            }
        })
    }
    /*
     * 页码点击
     * */
    handleChangePage(eventKey){
        this.setState({
            currentListPageNum:eventKey,
            dealListData:false,
        })
        this.loadDealList(eventKey,10,this.state.searchContent); //获取交易列表
    }
    /*
     * 输入页码跳转
     * */
    handleEnterPage(e){
        var re = /^[0-9]+$/;
        var indexCurrent = parseInt($(e.target).val())
        if (!re.test($(e.target).val())) {
            $(e.target).val('')
        }
        if (indexCurrent > this.state.dataListAllPage) {
            $(e.target).val(this.state.dataListAllPage)
        }
        if (indexCurrent <= 0) {
            $(e.target).val('')
        }
        if (e.keyCode == 13 && re.test($(e.target).val())) {    // 分页input回车
            this.setState({
                currentListPageNum:indexCurrent,
                dealListData:false,
            })
            this.loadDealList(indexCurrent,10,this.state.searchContent);
            $(e.target).val('')
        }
    }
    /*
     * 点击页码跳转按钮
     * */
    handleJumpPage(){
        if($('#pageJumpNum').val()==''){
            return;
        }else{
            var indexCurrent = parseInt($('#pageJumpNum').val());
            this.setState({
                currentListPageNum:indexCurrent,
                dealListData:false,
            })
            this.loadDealList(indexCurrent,10,this.state.searchContent);
        }

    }
    /*
    * 资产搜索
    * */
    searchGo(){
        var content = $('.searchText').val()
        this.setState({
            searchContent:content,
            dealListData:false,
        })
        // var pageNum = this.state.pageNum
        var self = this;
        $.ajax({
            url: fetchUrl+'/api/chain_trans/query_list/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data:{
                page:1,
                page_size:10,
                asset_search:content,
            },
            success:function(data){
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    var pages = parseInt(data.count/10)+((data.count%10)!=0?1:0)
                    self.setState({
                        dealListData:data.data,
                        dataListAllPage:pages,
                    })
                    $('#pageJumpNum').val('')
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }else{
                    self.setState({
                        dealListData:[],
                        dataListAllPage:0,
                        errorMsg:data.message,
                    })
                }

            },
            error:function(){
                self.setState({
                    dealListData:[],
                    dataListAllPage:0,
                    errorMsg:'服务器繁忙，请稍后重试～'
                })
            }
        })
            
    }
    /*
    * todo 下载附件
    * */
    handleDownLoadFile(assetId,e){
        var self = this
        e.stopPropagation()
        var assetId = assetId
        //api/chain_trans/down_tran_att/
        $.ajax({
            url: fetchUrl+'/api/chain_trans/down_tran_att/',
            type: 'GET',
            dataType: 'json',
            cache: false,
            data:{
                asset_id:assetId, //传入资产id
            },
            error:function(){
                return;
            },
            success: function (data) {
                if(data.code==200){
                    var link = document.createElement('a'); //创建事件对象
                    link.setAttribute('href', data.url);
                    link.setAttribute("download", '');
                    var event = document.createEvent("MouseEvents"); //初始化事件对象
                    event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null); //触发事件
                    link.dispatchEvent(event);
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
                    })
                }

            }
        })

    }
    //组件将要移除时
    componentWillUnmount() {

    }

    componentWillMount(){
        this.loadDealList(1,10,''); //获取交易列表
        this.loadAssetsTypeList(); //获取资产类型列表
        this.loadUsrList();//获取用户列表
    }
    componentDidMount() {
    }

    // 渲染页面
    render() {
        /*{todo 搜索交易列表}*/
        /*{todo 下载附件}*/
        return (
            <div className="content deal-list clearfix">
                {
                    this.state.loginTimeout &&
                    <LoginBox/>
                }

                <div className="deal-title">
                    <h1 className="first-title">资产交易历史记录</h1>
                    <h2 className="second-title">可查看您与他人的交易信息，或您个人的资产创建记录。</h2>
                    <button className="common-btn cancel-btn addNewAssetsBtn" onClick={this.handleAddNewAssets.bind(this)}>新建资产</button>
                    <div className="searchDeal">
                        <i className="fa fa-search fa-lg font-yellow"></i>
                        <input type="text" className="common-ipt searchText"/>
                        <button className="common-btn confirm-btn searchBtn" onClick={this.searchGo.bind(this)}>搜索</button>
                    </div>
                </div>
                <div className="deal-detail-list">
                    {
                        !this.state.dealListData &&
                        <LoadingText/>

                    }

                    {
                        this.state.dealListData &&
                        this.state.dealListData.map((data,index)=>{
                            return(
                                <div className="single-deal-detail" key={index}>
                                    <ul className="usr-deal-details clearfix" onClick={this.showDealDetailBox.bind(this,index,data.asset_id)}>
                                        <li className="list-icon">
                                            <i className="fa fa-folder font-yellow fa-2x"></i>
                                        </li>
                                        <li className="deal-assets ellipse">
                                            <b className="">资产内容：{data.asset}</b><br/>
                                            <b>附件： {data.filename}
                                            {
                                                data.filename!='' &&
                                                <i className="fa fa-download font-yellow" style={{margin:'0 0 0 8px',cursor:'pointer'}}
                                                    onClick={this.handleDownLoadFile.bind(this,data.asset_id)}
                                                ></i>
                                            }</b>
                                        </li>
                                        <li className="deal-usrMsg">
                                            <img src={(data.photo==null)?"static/img/Avatar.png":data.photo} alt=""/>
                                            <b>{data.username}</b>
                                        </li>
                                        <li className="deal-time">
                                            <b>{data.time}</b>
                                        </li>
                                        {
                                            data.confirm_status==0 &&
                                            <li className="deal-status">
                                                <i className="fa fa-spinner" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                <b>未证实</b>
                                            </li>
                                        }
                                        {
                                            data.confirm_status==1 &&
                                            <li className="deal-status">
                                                <i className="fa fa-check-circle" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                <b>证实成功</b>
                                            </li>
                                        }
                                        {
                                            data.confirm_status==2 &&
                                            <li className="deal-status">
                                                <i className="fa fa-times-circle" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                <b>证实失败</b>
                                            </li>
                                        }
                                        {
                                            data.enable_trans &&
                                            <li className="deal-trans"
                                                onClick={this.handleTransAssets.bind(this,data.type,data.asset,data.tx_id,data.filename,data.username)}>
                                                <a href="javascript:void(0)" > <i className="fa  fa-arrow-circle-right font-yellow fa-lg"></i>转移资产</a>
                                            </li>
                                        }

                                    </ul>

                                    <div className="detailHistoryCover" style={{display:'none'}}>
                                        {
                                            !data.detail &&
                                            <LoadingAction/>
                                        }
                                        {
                                            data.detail &&
                                            <div className="showDealTransHistrty clearfix">
                                                <h4>资产历史记录 <a href="javascript:void(0)" onClick={this.closeThisComponent.bind(this,index)}>
                                                    <i className="fa fa-close font-yellow"></i></a></h4>
                                                <h5>该资产的所有交易历史</h5>
                                                <div className="left-deal-assets-detail">
                                                    <h6>资产内容：</h6>
                                                    <p>{data.asset}</p>
                                                    <h6>附件：
                                                        <b className="file-name-msg"> {data.filename} </b>
                                                        {/*<i className="fa fa-download fa-lg font-yellow"></i>*/}
                                                    </h6>
                                                    {
                                                        data.confirm_status==0 &&
                                                        <h6>证实状态：
                                                            <i className="fa fa-spinner" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                            <b className="deal-status">未证实</b></h6>
                                                    }
                                                    {
                                                        data.confirm_status==1 &&
                                                        <h6>证实状态：
                                                            <i className="fa fa-check-circle" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                            <b className="deal-status">证实成功</b></h6>
                                                    }
                                                    {
                                                        data.confirm_status==2 &&
                                                        <h6>证实状态：
                                                            <i className="fa fa-times-circle" style={{margin:'0 8px',color:'#f5a623'}}></i>
                                                            <b className="deal-status">证实失败</b></h6>
                                                    }
                                                </div>
                                                <div className="right-deal-trans-detail">
                                                    {
                                                        !data.detail &&
                                                        <LoadingText/>
                                                    }
                                                    {
                                                        data.detail && data.detail.map((list,num)=>{
                                                            return (
                                                                <ul className="assets-trans-list">
                                                                    <li key={num}>
                                                                        <b><i className="fa fa-arrow-circle-right fa-2x font-yellow"></i> </b>
                                                                        <b className="font-yellow trans-type-time">{num==data.detail.length-1?'资产创建':'资产转移'}<br/>
                                                                            {list.time}
                                                                        </b>
                                                                        <b><img src={(list.photo==null)?"static/img/Avatar.png":list.photo} alt=""/></b>
                                                                        <b>{list.username} <br/>
                                                                            {list.department}
                                                                        </b>
                                                                    </li>
                                                                </ul>
                                                            )
                                                        })
                                                    }
                                                    <p className="errorMsg">{this.state.errorMsgBox}</p>
                                                </div>

                                            </div>
                                        }

                                    </div>
                                </div>
                            )
                        })

                    }
                </div>

                <p className="errorMsg">{this.state.errorMsg}</p>

                {
                    this.state.dealListData &&
                    <div className="pagination-all">
                        <Pagination prev={true} next={true} first={false} last={false} ellipsis={true} boundaryLinks={true} items={this.state.dataListAllPage}
                                    activePage={this.state.currentListPageNum} maxButtons={7} onSelect={this.handleChangePage.bind(this)}/>
                        <div className="pageCount">
                            <input className="pageNum"  id = "pageJumpNum" placeholder="输入" onKeyUp={this.handleEnterPage.bind(this)} onKeyDown={this.handleEnterPage.bind(this)}/>
                            <i className="fa fa-arrow-circle-right fa-lg"  onClick={this.handleJumpPage.bind(this)}></i>
                        </div>
                    </div>
                }


                {
                    this.state.addNewAssetsBox &&
                        <AddNewAssets
                            showLoadingAction = {this.state.showLoadingAction}
                            conformMsg = {this.state.conformMsg}
                            confirmAddAsset = {this.confirmAddAsset.bind(this)}
                            getTypeList = {this.state.getTypeList}
                            closeThisComponent = {this.closeThisComponent.bind(this)}
                        />
                }
                {
                    this.state.TransAssetsBox &&
                    <TransAssets
                        showLoadingAction = {this.state.showLoadingAction}
                        dealTransOwner = {this.state.dealTransOwner}
                        conformMsg = {this.state.conformMsg}
                        dealTransType = {this.state.dealTransType}
                        dealTransAsset = {this.state.dealTransAsset}
                        dealTransTxid = {this.state.dealTransTxid}
                        dealTransFile = {this.state.dealTransFile}
                        userTransList = {this.state.userTransList}
                        confirmTransAssets = {this.confirmTransAssets.bind(this)}
                        closeThisComponent = {this.closeThisComponent.bind(this)}
                    />
                }
            </div>
        )
    }
}




