

import React from "react"
import { render } from "react-dom"
import $ from "jquery";
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overFlowFileSize:'', //图片最大尺寸
            imgSrc:'', //图片src地址
        }
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

    componentDidMount() {

    }

    render() {
       
        return (
            <div className='login-page clearfix' >
                <div className="left-project-msg">
                    <img src="../static/img/logo.svg" alt="" className="login-logo-icon"/>
                    <div className="project-intro">
                        <h1>区块链用户端</h1>
                        <h2>登录用户端以创建或转移资产。若还没有账户，请提交权限申请，等待管理员回应。</h2>
                        {
                            this.props.loginOrApply &&
                            <button className="common-btn confirm-btn" onClick={this.props.handleToggleLogin.bind(this)}>申请权限</button>
                        }
                        {
                            !this.props.loginOrApply &&
                            <button className="common-btn confirm-btn" id = "btn-login-enter" onClick={this.props.handleToggleLogin.bind(this)}>登录</button>
                        }
                    </div>
                    <ul className="jump-other-website">
                        <li><a href="http://www.8lab.cn" target="_blank">八分量官网 <i className="fa fa-external-link"></i></a></li>
                        <li><a href="javascript:void(0)">管理员系统登录 <i className="fa fa-external-link"></i></a></li>
                        <li><a href="javascript:void(0)">咨询管理员 <i className="fa fa-external-link"></i></a></li>
                    </ul>
                </div>
                <div className="right-project-login">
                    {
                        this.props.loginOrApply &&
                        <div className="login-form" onKeyDown={this.props.keyLogin.bind(this)}>
                            <h3>登录</h3>
                            <div className="form-ipt-cover">
                                <p>用户名</p>
                                <input type="text" style={{display:'none'}}/>
                                <i className="fa fa-user fa-lg font-yellow"></i>
                                <input type="text" className="common-ipt login-username"/>
                            </div>
                            <div className="form-ipt-cover">
                                <p>密码</p>
                                <input type="password" style={{display:'none'}}/>
                                <i className="fa fa-lock fa-lg font-yellow"></i>
                                <input type="password" className="common-ipt login-password"/>
                            </div>

                            <button className="common-btn confirm-btn login-btn" onClick={this.props.login.bind(this)}>登录</button>
                            <p className="errorMsg">{this.props.error}</p>
                        </div>
                    }
                    {
                        !this.props.loginOrApply &&
                        <div className="apply-form">
                            <h3>申请权限</h3>
                            <div className="userApply-cover clearfix">
                                <div className="form-ipt-cover userApply-icon">
                                    <p>姓名</p>
                                    <i className="fa fa-user fa-lg font-yellow"></i>
                                    <input type="text" className="common-ipt userApply-ipt register-real-name"/>
                                </div>
                                <div className="form-ipt-cover userApply-icon">
                                    <p>用户名</p>
                                    <input type="text" style={{display:'none'}}/>
                                    <i className="fa fa-at fa-lg font-yellow"></i>
                                    <input type="text" className="common-ipt userApply-ipt register-user-name"/>
                                </div>
                                <div className="uploadIcon">
                                    <img src={this.state.imgSrc==''?'./static/img/Avatar.png':this.state.imgSrc} alt=""/>
                                    {/*<form id= "uploadFileForm" className="clearfix" encType="multipart/form-data" >*/}
                                        {/*<input type="file" className="selectUsrIcon register-user-img"*/}
                                               {/*accept='image/jpg,image/jpeg,image/png,image/svg'*/}
                                               {/*onChange={this.handleUploadImg.bind(this)}/>*/}
                                        {/*<button className="change-usr-icon" type="button" >上传头像</button>*/}
                                        {/*<p className="fileLimit">已上传 {this.state.imgSize/1000} kb <br/><b>头像最大不超过100KB</b></p>*/}
                                    {/*</form>*/}
                                </div>
                            </div>
                            <div className="form-ipt-cover">
                                <p>姓名一栏请填写真实姓名，便于管理员审核。用户名可与姓名不同，但只可包含2～ 20位中英文、数字和下划线。</p>
                            </div>
                            <div className="form-ipt-cover">
                                <p>电话</p>
                                <i className="fa fa-phone-square fa-lg font-yellow"></i>
                                <input type="text" className="common-ipt register-user-phone"/>
                            </div>
                            <div className="form-ipt-cover">
                                <p>邮箱</p>
                                <i className="fa fa-envelope-square fa-lg font-yellow"></i>
                                <input type="text" className="common-ipt register-user-email"/>
                            </div>
                            <div className="form-ipt-cover">
                                <p>密码</p>
                                <input type="password" style={{display:'none'}}/>
                                <i className="fa fa-lock fa-lg font-yellow"></i>
                                <input type="password" className="common-ipt register-user-pwd"/>
                            </div>
                            <div className="form-ipt-cover">
                                <p>再次输入密码</p>
                                <input type="password" style={{display:'none'}}/>
                                <i className="fa fa-lock fa-lg font-yellow"></i>
                                <input type="password" className="common-ipt register-user-rePwd"/>
                            </div>
                            <button className="common-btn confirm-btn login-btn" onClick={this.props.register.bind(this)}>提交申请</button>
                            <p className="errorMsg">{this.props.error}</p>
                        </div>
                    }

                </div>
            </div>
        );
    }
}