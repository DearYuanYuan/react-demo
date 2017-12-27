
import React from "react";
import $ from 'jquery';

import LoadingAction from './ActionLoading.js'
/* 首页 */
export default class AddNewAssets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSize:0,
            overFlowFileSize:'',
            fileUploadName:'',
            showTypeSelectBox:false,
            assetType:'',
            assetTypeKey:''
        }
    }


    handleUploadFile(){
        var file = $('#uploadFileForm .selectUsrIcon')[0].files[0]
        // console.log(file)
        if(!file){
            this.setState({
                fileUploadName:'',
                imgSize:0
            })
        }
        // else if(file.type!='application/json'&&file.type!='text/plain'){
        //     this.setState({
        //         fileUploadName:'请选择json或者txt格式的文件上传',
        //         imgSize:0
        //     })
        //     //清空所选的文件
        //     var fileUp = $('#uploadFileForm .selectUsrIcon')
        //     fileUp.after(fileUp.clone().val(''))
        //     fileUp.remove()
        // }
        else if(file.size/1000>512){
            //当文件大于1M
            this.setState({
                fileUploadName:'文件超过512KB，请重新选择',
                imgSize:0
            })
            //清空所选的文件
            var fileUp = $('#uploadFileForm .selectUsrIcon')
            fileUp.after(fileUp.clone().val(''))
            fileUp.remove()
        }else{
            this.setState({
                fileUploadName:file.name,
                imgSize:file.size
            })
        }
    }
    /*
    * 资产类型点击
    * */
    handleSelectContent(e){
        this.setState({
            assetType: $(e.target).text(),
            showTypeSelectBox:false,
            assetTypeKey:$(e.target).attr('name')
        })

    }
    /*
    * 点击资产类型下拉框
    * */
    handleShowAssetType(){
        this.setState({
            showTypeSelectBox:!this.state.showTypeSelectBox
        })
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
            <div className="detailHistoryCover">
                <div className="showDealTransHistrty clearfix addOrTransAssets">
                    <h4>新建资产
                        <a href="javascript:void(0)" onClick={this.props.closeThisComponent.bind(this)}> <i className="fa fa-close font-yellow"></i></a></h4>
                    <h5>创建到当前账户</h5>
                    <div className="addOrTransAssets-params">
                        <p>资产类型</p>
                        <i className="fa fa-list-ul fa-lg font-yellow assetsIcon-user"></i>
                        <input type="text" title = {this.state.assetTypeKey}
                               className="common-ipt assetsIcon-ipt add-assets-type" readOnly value={this.state.assetType}/>
                        <i className="fa fa-angle-down fa-lg font-yellow assetsIcon-select" onClick={this.handleShowAssetType.bind(this)}></i>
                        {
                            this.state.showTypeSelectBox &&
                            <div className="getIptList"
                                 onClick={this.handleSelectContent.bind(this)}>
                                {this.props.getTypeList.map(function(data,index){
                                    return(
                                        <h6 key={index} name={data.key}>{data.name}</h6>
                                    )
                                })}
                            </div>
                        }

                    </div>
                    <div className="addOrTransAssets-params">
                        <p>资产内容</p>
                        <textarea className="assets-content" id="add-assets-content"></textarea>
                    </div>
                    <div className="addOrTransAssets-params">
                        <p>附件</p>
                        <h6 className="fileLimit">{this.state.fileUploadName}</h6>
                        <form id= "uploadFileForm" className="clearfix" encType="multipart/form-data" >
                            <input type="file" className="selectUsrIcon add-assets-file"
                                   onChange={this.handleUploadFile.bind(this)}/>
                            <button className="upload-file confirm-btn common-btn" type="button" >上传附件</button>
                        </form>
                        <h6 className="fileLimit">已上传 {this.state.imgSize/1000} kb <b>文件最大不超过512KB</b></h6>
                    </div>
                    <p>
                        <button className="common-btn cancel-btn gaps" onClick={this.props.closeThisComponent.bind(this)}>取消</button>
                        <button className="common-btn confirm-btn" onClick={this.props.confirmAddAsset.bind(this)}>确认</button>
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




