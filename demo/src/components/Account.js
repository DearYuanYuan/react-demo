
import React from "react";
import $ from 'jquery';

import LoadingAction from './ActionLoading.js'
import LoginBox from  './LoginBox'
/* 首页 */
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc:null, //图片地址
            changePwd:false, //修改密码弹框
            errorModifyMsg:'', //修改用户信息错误提示
            errorPwdMsg:'', //修改密码错误提示
            currentRealName:'', //当前用户的真实姓名
            currentUsrName:'',//当前用户的用户名
            currentUsrPhone:'',//当前用户的手机号码
            currentUsrEmail:'',//当前用户的邮箱
            currentUsrDep:'',
            currentUsrJob:'',
            showLoadingAction:false,//ajax请求loading效果
            overFlowFileSize:false,//是否显示上传头像提示
            loginTimeout:false,
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
                        currentUsrDep:data.user_detail.department,
                        currentUsrJob:data.user_detail.job,
                        imgSrc:data.user_detail.photo,
                    })
                }else if(data.code==210){
                    self.setState({
                        loginTimeout:true,
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
                overFlowFileSize:'图片大小超过100KB，请重新选择'
            })
            //清空所选的文件
            var fileUp = $('#uploadFileForm .selectUsrIcon')
            fileUp.after(fileUp.clone().val(''))
            fileUp.remove()
        }else{
            var reader = new FileReader();
            //读取文件src
            reader.onload = function(e){
                var self = this;
                self.setState({
                    imgSrc:e.target.result,
                    overFlowFileSize:false,
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
        var rePwd = /^[a-zA-Z0-9_]{6,18}/
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
                errorPwdMsg:'密码规则：6-18位数字字母下划线'
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
                            errorPwdMsg:'密码修改成功',
                        })
                        setTimeout(function () {
                            self.setState({
                                errorPwdMsg:'',
                                changePwd:false,
                                showLoadingAction:false,
                            })
                        },2000)
                    }else if(data.code==210){
                        self.setState({
                            loginTimeout:true,
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
                        errorPwdMsg:"服务器繁忙，请稍后重试～",
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
        var userDep = $('.apply-usr-dep').val();
        var userJob = $('.apply-usr-job').val();
        var usrPhone = $('.apply-usr-phone').val();
        var usrEmail = $('.apply-usr-email').val();
        var reRealName = /^[\u4e00-\u9fa5A-Za-z]{2,20}$/
        var reJob =  /^[\u4e00-\u9fa5A-Za-z]{1,20}$/
        var reEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        var rePhone = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/

        if(realName==''&&usrPhone==''&&usrEmail==''&&userDep==''&&userJob==''&&!$('#uploadFileForm .selectUsrIcon')[0].files[0]){
            this.setState({
                errorModifyMsg:'请输入您要修改的项'
            })
        }
        else if(!reRealName.test(realName) && realName!='' ){
            this.setState({
                errorModifyMsg:'请输入正确的姓名（字母汉字2-20位）'
            })
            $('.apply-real-name').focus()
        }
        else if(!reJob.test(userDep) && userDep!='' ){
            this.setState({
                errorModifyMsg:'职位请输入1-20位数字字母汉字'
            })
            $('.apply-usr-dep').focus()
        }
        else if(!reJob.test(userJob) && userJob!='' ){
            this.setState({
                errorModifyMsg:'职位请输入1-20位数字字母汉字'
            })
            $('.apply-usr-job').focus()
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
            var formData = new FormData();
            formData.append('name',realName)
            formData.append('email',usrEmail)
            formData.append('phone',usrPhone)
            formData.append('department',userDep)
            formData.append('job',userJob)
            formData.append('file',$('#uploadFileForm .selectUsrIcon')[0].files[0])
            $.ajax({
                url: "api/chain_user/modify/",
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data:formData
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
                        },2000)
                    }else if(data.code==210){
                        self.setState({
                            loginTimeout:true,
                        })
                    }else{
                        self.setState({
                            errorModifyMsg:data.message,
                            showLoadingAction:false,
                        });
                    }
                })
                .error(function(){
                    self.setState({
                        errorModifyMsg:"服务器繁忙，请稍后重试～",
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
                {
                    this.state.loginTimeout &&
                    <LoginBox/>
                }
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
                            <img src={!this.state.imgSrc?'./static/img/Avatar.png':this.state.imgSrc} alt=""/>
                            <form id= "uploadFileForm" className="clearfix" encType="multipart/form-data" >
                                <input type="file" className="selectUsrIcon"
                                       accept='image/jpg,image/jpeg,image/png,image/svg'
                                       onChange={this.handleUploadImg.bind(this)}/>
                                <button className="change-usr-icon" type="button" >更换头像</button>

                            </form>

                        </div>

                    </div>
                    {
                        this.state.overFlowFileSize &&
                        <p className="fileLimit">{this.state.overFlowFileSize}</p>
                    }

                    <div className="form-ipt-cover">
                        <p>姓姓名一栏请填写真实姓名，便于管理员审核。用户名可与姓名不同，但只可包含2～ 20位中英文、数字和下划线。</p>
                    </div>
                    <div className="form-ipt-cover">
                        <p>部门</p>
                        <input type="text" style={{display:'none'}}/>
                        <i className="fa fa-user fa-lg font-yellow"></i>
                        <input type="text" className="common-ipt apply-usr-dep" placeholder={this.state.currentUsrDep}/>
                    </div>
                    <div className="form-ipt-cover">
                        <p>职位</p>
                        <input type="text" style={{display:'none'}}/>
                        <i className="fa fa-user fa-lg font-yellow"></i>
                        <input type="text" className="common-ipt apply-usr-job" placeholder={this.state.currentUsrJob}/>
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




