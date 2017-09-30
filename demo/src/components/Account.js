
import React from "react";
import $ from 'jquery';

import LoadingAction from './ActionLoading.js'
/* 首页 */
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc:'', //图片地址
            changePwd:false, //修改密码弹框
            errorModifyMsg:'', //修改用户信息错误提示
            errorPwdMsg:'', //修改密码错误提示
            currentRealName:'', //当前用户的真实姓名
            currentUsrName:'',//当前用户的用户名
            currentUsrPhone:'',//当前用户的手机号码
            currentUsrEmail:'',//当前用户的邮箱
            showLoadingAction:false,//ajax请求loading效果
        }
    }
    /*
    * 关闭弹框
    * */
    closeThisComponent(){
        this.setState({
            changePwd:false,
            errorPwdMsg:'',
        })
    }
    /*
    * 获取用户信息详情
    * */
    loadCurrentUsrMsg(){
        var self  = this;
        $.ajax({
            url: 'api/chain_user/query_detail/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (data) {
                // console.log(JSON.stringify(data))
                if(data.code==200){
                    self.setState({
                        currentRealName:data.user_detail.name,
                        currentUsrName:data.user_detail.username,
                        currentUsrPhone:data.user_detail.phone,
                        currentUsrEmail:data.user_detail.email,
                    })
                }
            }
        })
    }
    //todo 上传照片
    handleUploadImg(){
        var file = $('#uploadFileForm .selectUsrIcon')[0].files[0]
        if(file.size/1000>100){
            //当文件大于1M
            this.setState({
                overFlowFileSize:'文件超过100KB，请重新选择'
            })
            //清空所选的文件
            var fileUp = $('#uploadFileForm .selectUsrIcon')
            fileUp.after(file.clone().val(''))
            fileUp.remove()
        }else{
            var reader = new FileReader();
            //读取文件src
            reader.onload = function(e){
                var self = this;
                self.setState({
                    imgSize:file.size,
                    imgSrc:e.target.result
                })
            }.bind(this)
            reader.readAsDataURL(file);
        }
    }
    /*
    * 点击修改密码按钮，弹框显示
    * */
    handleShowChangePwd(){
        this.setState({
            changePwd:true,
            errorModifyMsg:''
        })
    }
    /*
    * 修改密码
    *  password:usrOldPwd,
       newpassword:usrNewPwd,
    * */
    confirmChangePwd(){
        var usrOldPwd = $('.apply-old-pwd').val();
        var usrNewPwd = $('.apply-new-pwd').val();
        var usrNextPwd = $('.apply-next-pwd').val();
        var rePwd = /^[a-zA-Z0-9]{6,20}/
        if(usrOldPwd==''){
            this.setState({
                errorPwdMsg:'请输入旧密码'
            })
        }
        else if(usrNewPwd==''){
            this.setState({
                errorPwdMsg:'请输入新密码'
            })
        }
        else if(usrNextPwd==''){
            this.setState({
                errorPwdMsg:'请再次输入密码'
            })
        }
        else if(!rePwd.test(usrNewPwd)){
            this.setState({
                errorPwdMsg:'密码规则：6-20位数字字母'
            })
        }
        else if(usrNewPwd!=usrNextPwd){
            this.setState({
                errorPwdMsg:'两次密码输入不一致'
            })
        }
        else{
            var self = this
            self.setState({
                showLoadingAction:true,
            })
            $.ajax({
                url: "api/modify_pass/",
                type: 'POST',
                dataType: 'json',
                cache: false,
                data:{
                    password:usrOldPwd,
                    newpassword:usrNewPwd,
                }
            })
                .success(function(data){
                    // console.log(JSON.stringify(data))
                    if(data.code == 200){
                        self.setState({
                            errorPwdMsg:'',
                            changePwd:false,
                            showLoadingAction:false,
                        })
                    }else{
                        self.setState({
                            errorPwdMsg:data.message,
                            showLoadingAction:false,
                        });
                    }
                })
                .error(function(){
                    self.setState({
                        errorPwdMsg:"修改失败",
                        showLoadingAction:false,
                    });
                });

        }
    }
    /*
    * 确认修改
    *  name:realName,
       email:usrEmail,
       phone:usrPhone,
    * */
    handleConfirmModify(){
        //chain_user/modify
        var realName = $('.apply-real-name').val();
        var usrPhone = $('.apply-usr-phone').val();
        var usrEmail = $('.apply-usr-email').val();

        var reRealName = /^[\u4e00-\u9fa5A-Za-z]{2,5}/
        var reEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        var rePhone = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/

        if(realName==''&&usrPhone==''&&usrEmail==''){
            this.setState({
                errorModifyMsg:'请输入您要修改的项'
            })
        }
        else if(!reRealName.test(realName) && realName!='' ){
            this.setState({
                errorModifyMsg:'请输入正确的姓名'
            })
            $('.apply-real-name').focus()
        }
        else if(!rePhone.test(usrPhone) && usrPhone!='' ){
            this.setState({
                errorModifyMsg:'请输入正确的手机号码'
            })
            $('.apply-usr-phone').focus()
        }
        else if(!reEmail.test(usrEmail) && usrEmail!=''){
            this.setState({
                errorModifyMsg:'请输入正确的邮箱'
            })
            $('.apply-usr-email').focus()
        }
        else{
            var self = this
            self.setState({
                showLoadingAction:true,
            })
            $.ajax({
                url: "api/chain_user/modify/",
                type: 'POST',
                dataType: 'json',
                cache: false,
                data:{
                    name:realName,
                    email:usrEmail,
                    phone:usrPhone,
                }
            })
                .success(function(data){
                    // console.log(JSON.stringify(data))
                    if(data.code == 200){
                        self.setState({
                            errorModifyMsg:'修改成功',
                            showLoadingAction:false,
                        })
                        setTimeout(function(){
                            self.loadCurrentUsrMsg();
                            self.setState({
                                errorModifyMsg:''
                            })
                        },1000)
                    }else{
                        self.setState({
                            errorModifyMsg:data.message,
                            showLoadingAction:false,
                        });
                    }
                })
                .error(function(){
                    self.setState({
                        errorModifyMsg:"修改失败",
                        showLoadingAction:false,
                    });
                });

        }

    }
    //组件将要移除时
    componentWillUnmount() {
    }

    componentWillMount(){
        this.loadCurrentUsrMsg(); //加载用户信息
    }
    componentDidMount() {
    }

    // 渲染页面
    render() {

        return (
            <div className="account-content right-project-login">
                <div className="apply-form">
                    <h3>账户信息</h3>
                    <h4>修改您的账户信息</h4>
                    <div className="userApply-cover clearfix">
                        <div className="form-ipt-cover userApply-icon">
                            <p>姓名</p>
                            <input type="text" style={{display:'none'}}/>
                            <i className="fa fa-user fa-lg font-yellow"></i>
                            <input type="text" className="common-ipt userApply-ipt apply-real-name"
                                   defaultValue={this.state.currentRealName}
                                   placeholder={this.state.currentRealName}/>
                        </div>
                        <div className="form-ipt-cover userApply-icon">
                            <p>用户名</p>
                            <input type="text" style={{display:'none'}}/>
                            <i className="fa fa-at fa-lg font-yellow"></i>
                            <input type="text" className="common-ipt userApply-ipt apply-usr-name" value={this.state.currentUsrName} readOnly/>
                        </div>
                        <div className="uploadIcon">
                            <img src={this.state.imgSrc==''?'./static/img/Avatar.png':this.state.imgSrc} alt=""/>
                            {/*<form id= "uploadFileForm" className="clearfix" encType="multipart/form-data" >*/}
                                {/*<input type="file" className="selectUsrIcon"*/}
                                       {/*accept='image/jpg,image/jpeg,image/png,image/svg'*/}
                                       {/*onChange={this.handleUploadImg.bind(this)}/>*/}
                                {/*<button className="change-usr-icon" type="button" >更换头像</button>*/}
                                {/*/!*<p className="fileLimit">已上传 {this.state.imgSize/1000} kb <br/><b>头像最大不超过100KB</b></p>*!/*/}
                            {/*</form>*/}
                        </div>
                    </div>
                    <div className="form-ipt-cover">
                        <p>姓姓名一栏请填写真实姓名，便于管理员审核。用户名可与姓名不同，但只可包含2～ 20位中英文、数字和下划线。</p>
                    </div>
                    <div className="form-ipt-cover">
                        <p>电话</p>
                        <input type="text" style={{display:'none'}}/>
                        <i className="fa fa-phone-square fa-lg font-yellow"></i>
                        <input type="text" className="common-ipt apply-usr-phone" placeholder={this.state.currentUsrPhone}/>
                    </div>
                    <div className="form-ipt-cover">
                        <p>邮箱</p>
                        <input type="text" style={{display:'none'}}/>
                        <i className="fa fa-envelope-square fa-lg font-yellow"></i>
                        <input type="text" className="common-ipt apply-usr-email" placeholder={this.state.currentUsrEmail}/>
                    </div>
                    {
                        // !this.state.changePwd &&
                        <p className="changePassword" onClick={this.handleShowChangePwd.bind(this)}>
                            <i className="fa fa-angle-down fa-lg font-yellow assetsIcon-select"></i>  修改密码</p>
                    }
                    {
                        this.state.changePwd &&
                        <div className="detailHistoryCover">
                            <div className="showDealTransHistrty changePwdBox">
                                <h4>修改密码 <a href="javascript:void(0)" onClick={this.closeThisComponent.bind(this)}>
                                    <i className="fa fa-close font-yellow"></i></a></h4>
                                <div className="form-ipt-cover">
                                    <p>旧密码</p>
                                    <input type="password" style={{display:'none'}}/>
                                    <i className="fa fa-lock fa-lg font-yellow"></i>
                                    <input type="password" className="common-ipt apply-old-pwd"/>
                                </div>
                                <div className="form-ipt-cover">
                                    <p>新密码</p>
                                    <input type="password" style={{display:'none'}}/>
                                    <i className="fa fa-lock fa-lg font-yellow"></i>
                                    <input type="password" className="common-ipt apply-new-pwd"/>
                                </div>
                                <div className="form-ipt-cover">
                                    <p>再次输入密码</p>
                                    <input type="password" style={{display:'none'}}/>
                                    <i className="fa fa-lock fa-lg font-yellow"></i>
                                    <input type="password" className="common-ipt apply-next-pwd"/>
                                </div>
                                <p className="changePwd-btn-orNot">
                                    <button className="common-btn cancel-btn gaps" onClick={this.closeThisComponent.bind(this)}>取消</button>
                                    <button className="common-btn confirm-btn" onClick={this.confirmChangePwd.bind(this)}>确认</button>
                                </p>
                                <p className="errorMsg">{this.state.errorPwdMsg}</p>
                            </div>
                            {
                                this.state.showLoadingAction &&
                                <LoadingAction/>
                            }
                        </div>
                    }

                    <button className="common-btn confirm-btn login-btn"
                            onClick={this.handleConfirmModify.bind(this)}>确认修改</button>
                    <p className="errorMsg">{this.state.errorModifyMsg}</p>
                </div>
                {
                    this.state.showLoadingAction &&
                    <LoadingAction/>
                }
            </div>
        )
    }
}




