//封装正则验证对象
var strategies = {
    //not empty
    isNonEmpty:function(value,errorMessage){
        if(value===''){
            return errorMessage
        }
    },
    // min length
    minLength:function(value,length,errorMessage){
        if(value.length < length){
            return errorMessage
        }
    },
    // phone
    isMobile:function(value,errorMessage){
        if(!/^1[3|5|8][0-9]{9}$/.test(value)){
            return errorMessage
        }
    }
}
export default class Validator{

    cache = [] //初始化暂存验证所需要的参数（验证的value，验证的方法名，验证失败的提示信息）
    //类的add方法
    add = function(dom,rules){
        var self = this;
        //循环,可能有多个验证规则
        for(var i = 0 ,rule ; rule = rules[i++] ;){
            (function(rule){
                var strategyAry = rule.strategy.split(':');  //将验证方法名和有些验证方法需要传入的参数分开
                var errorMessage = rule.errorMessage;
                self.cache.push(function(){
                    var strategy = strategyAry.shift(); //把验证方法名取出来
                    strategyAry.unshift(dom.value) //数组前面加上需要验证的value
                    strategyAry.push(errorMessage); //数组后面加上验证失败的提示信息
                    //调用正则方法中的对应方法，传入需要验证的dom，和ary数组（验证方法所需的参数）
                    return strategies[strategy].apply(dom,strategyAry)
                })
            })(rule)
        }
    }
//类的start验证方法
    start = function(){
        for(var i = 0; i < this.cache.length; i++){
            var validataFunc = this.cache[i]
            var msg = validataFunc()
            if(msg){
                return msg
            }
        }
    }
}
