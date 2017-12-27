import React from "react"
import $ from 'jquery';
//引入react
// 向外暴露Loading模块
export  default  class LoginBox  extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            showLoginBox:'block',
            error:''
        }
    }
    /*
     * 登录
     * */
    login(){
        /**/
        var self = this
        var username = $('.login-username').val();
        var password = $('.login-password').val();
        //console.log(username,password)
        $.ajax({
            url: "api/login/",
            type: 'POST',
            dataType: 'json',
            cache: false,
            data:{
                username: username,
                password: password,
            }
        })
            .success(function(data){
                // console.log(JSON.stringify(data))
                if(data.code == 200 || data.code == 203){
                    self.setState({
                        showLogin:false,
                        userName:username,
                        error:'',
                        showLoginBox:'none'
                    })
                    //删除成功重新加载页面
                    window.location.reload()
                }else{
                    self.setState({
                        error:data.message
                    });
                }
            })
            .error(function(){
                self.setState({
                    error:"服务器繁忙，请稍后重试～"
                });
            });

    }
    /*
     * enter 登录
     * */
    keyLogin(event){
        if (event.keyCode==13){
            this.login();
        }
    }
    render(){
        return(
            <div className="reLoginBox"  onKeyDown={this.keyLogin.bind(this)} style={{display:this.state.showLoginBox}}>
                <div className="re-login-form">
                    <h3>重新登录</h3>
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

                    <button className="common-btn confirm-btn login-btn" onClick={this.login.bind(this)}>登录</button>
                    <p className="errorMsg">{this.state.error}</p>
                </div>
            </div>
        )
    }
}