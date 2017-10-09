import ReactDOM from 'react-dom';
import './style/common.less';
import registerServiceWorker from './registerServiceWorker';
import React, { Component } from 'react';
import $ from "jquery";
import { BrowserRouter, Router, Route, Match, HashRouter, Link,IndexLink,hashHistory } from 'react-router-dom'
import Login from "./components/Login"
import Deal from "./components/Deal"
import Account from "./components/Account"
import Home from "./components/Home"
import HeadLine from './components/HeadLine.js'
import loginDate from './data/login.json'
import Validator from './func/form.js'
import 'whatwg-fetch'
require('./func/form.js')
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin:true, //是否显示登录界面
            error:'', //登录或注册显示的错误信息
            userName:'', //用户名
            loginOrApply:true, //登录或申请权限
        }        
    }
    //切换登录-申请权限
    handleToggleLogin(){
        this.setState({
            loginOrApply:!this.state.loginOrApply,
            error:''
        })
    }
    /*
    * 注册
    * */
    register(){
        var realName = $('.register-real-name').val();
        var userName = $('.register-user-name').val();
        var userPhone = $('.register-user-phone').val();
        var userEmail = $('.register-user-email').val();
        var userPwd = $('.register-user-pwd').val();
        var userRePwd = $('.register-user-rePwd').val();

        var reRealName = /^[\u4e00-\u9fa5a-zA-Z]{2,5}/
        var reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,20}/
        var reEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        var rePhone = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
        var rePwd = /^[a-zA-Z0-9]{6,20}/
        if(realName==''){
            this.setState({
                error:'请输入您的真实姓名'
            })
        }
        else if(userName==''){
            this.setState({
                error:'请输入您的用户名'
            })
        }
        else if(userPhone==''){
            this.setState({
                error:'请输入您的手机号码'
            })
        }
        else if(userEmail==''){
            this.setState({
                error:'请输入您的邮箱'
            })
        }
        else if(userPwd==''){
            this.setState({
                error:'请输入您的密码'
            })
        }
        else if(userRePwd==''){
            this.setState({
                error:'请再次输入您的密码'
            })
        }
        else if(!reRealName.test(realName)){
            this.setState({
                error:'请输入正确的姓名'
            })
            $('.register-real-name').focus()
        }
        else if(!reName.test(userName)){
            this.setState({
                error:'用户名规则：请输入数字字母汉字'
            })
            $('.register-user-name').focus()
        }
        else if(!rePhone.test(userPhone)){
            this.setState({
                error:'请输入正确的手机号码'
            })
            $('.register-user-phone').focus()
        }
        else if(!reEmail.test(userEmail)){
            this.setState({
                error:'请输入正确的邮箱'
            })
            $('.register-user-email').focus()
        }
        else if(!rePwd.test(userPwd)){
            this.setState({
                error:'密码规则：6-20位数字字母'
            })
            $('.register-user-pwd').focus()
        }
        else if(userPwd!=userRePwd){
            this.setState({
                error:'两次密码输入不一致'
            })
            $('.register-user-rePwd').focus();
        }
        else{
           this.setState({
            loginOrApply:!this.state.loginOrApply,
              error:''
           })
           window.location.href = '#/'     
        }
    }
    /*
    * 登录
    * */
    login(){
        var registerForm = document.getElementById('registerForm')
        var errorMsg = document.getElementById('errorMsg')
        //新建一个验证的类，并加入需要验证的项
        var validataFunc = function(){
            var validator = new Validator()
            validator.add(registerForm.userName,
                [{strategy:'isNonEmpty',errorMessage:'用户名不能为空'},
                    {strategy:'minLength:6',errorMessage:'用户名不能少于6位'}]
            );
            validator.add(registerForm.password,
                [{strategy:'isNonEmpty',errorMessage:'密码不能为空'},
                    {strategy:'minLength:6',errorMessage:'密码不能少于6位'}]
            );
            var errorMessage = validator.start()
            return errorMessage
        }

        //调用
        registerForm.onsubmit = function(){
            var errorMessage = validataFunc();
            if(errorMessage){
                errorMsg.innerText = errorMessage
                return false;
            }else{
                this.setState({
                    showLogin:false
                })
                window.location.href = '#/deal'
                errorMsg.innerText = ""
            }
        }
    }
    /*
    * 删除cookie
    * */
    deleteCookie(name){
        var date=new Date();
        date.setTime(date.getTime()-10000);
        document.cookie=name+"=v; expires="+date.toGMTString();
    }
    /*
    * 注销
    * */
    logout(){
        this.deleteCookie('8l_cookie');
        this.setState({
            showLogin:true
        })
        window.location.href = '#/'
    }
    /*
    * 获取cookie
    * */
    getCookie(name){
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; ");
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(arr[0]==name){
                //当查到cookie，则不需要登录
                // console.log( arr[1]);
                this.setState({
                    showLogin:false,
                    userName:arr[1].split('|')[0]
                })
                // window.location.href = '#/deal';
                return;
            }
        }
        //未查到cookie，则进入登录页面
        this.setState({
            showLogin:true
        })
        window.location.href = '#/'
        // console.log(arrCookie)
    }
    /*
    * enter 登录
    * */
    keyLogin(event){
        if (event.keyCode==13){
            this.login();
        }
    }
    /**
     * 组件将要加载时的操作
     */
    componentWillMount(){

    }

    /**
     * 组件加载完成时的操作
     */
    componentDidMount(){
        //页码加载时，判断是否有cookie
        this.getCookie('8l_cookie');
    }


    render() {
        return (
            <div id="fuzhou">
              <img src="./static/data/login.json" alt=""/>
                {
                    this.state.showLogin &&
                        <div>
                            <Login
                                loginOrApply = {this.state.loginOrApply}
                                error = {this.state.error}
                                login = {this.login.bind(this)}
                                keyLogin = {this.keyLogin.bind(this)}
                                register = {this.register.bind(this)}
                                handleToggleLogin = {this.handleToggleLogin.bind(this)}
                            />
                        </div>
                }
                {
                    !this.state.showLogin &&
                    <div>
                        <HeadLine
                            userName = {this.state.userName}
                            logout = {this.logout.bind(this)}
                        />
                        <Home/>

                    </div>
                }
                {this.props.children}

            </div>
        )
    }
}
// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <HashRouter>
      <App>
        <Route path='/login' component={Login} />
          {/*<IndexRedirect to="/login" />*/}
            <Route exact path="/" component={Deal} />
            <Route path='/deal' component={Deal} />
            <Route path='/account' component={Account} />
        </App>
    </HashRouter>
, document.getElementById('root'))

registerServiceWorker();

