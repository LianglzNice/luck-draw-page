//弹出层js
//获取用户浏览器信息
var ua = navigator.userAgent;
//是否为ios系统ipad
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
//是否为ios系统iphone
var isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
//是否为android系统
var isAndroid = ua.match(/(Android)\s+([\d.]+)/);
var isMobile = isIphone || isAndroid;

//控制实现方式（全局性质）
//目前分layer、自定义(custom)，未来有更好的提示插件可按此规则进行扩展
var msgPlugin = 'layer'; //默认layer
//var msgPlugin = 'custom';

function BaseMsg(){
    /*
     * 普通提示框
     * @param content 消息内容
     * @param msgtype 消息类型，info：提示；warn:警告；success：正确、成功；error：错误、失败；yesno：判断
     * @param fn 动态函数，可选
     * @return 无返回
     */
    this.msg = function(content,msgtype,fn){}

    /*
     * 判断确认框
     * @param content 消息内容
     * @param fn 动态函数，可选
     * @return 无返回
     */
    this.yesNo = function(content,fn){}

    /*
     * 退出确认框
     * @param url 退出URL
     * @return 无返回
     */
    this.quit = function(url){}

    /**
     * tip提示框
     * @param obj 元素自身对象this
     * @param content 提示的内容
     * @param direction 提示信息出现位置1.上  2.右  3.下  4.左
     * @param color 提示信息背景颜色1.#xxxxxx 2.rgb(xx,xx,xx)
     * @return 无返回
     */
    this.tip = function(obj,content,direction,color){}

    /*
     * 自定义弹框
     * @param type 弹出层类型 html:1 url:2
     * @param title 标题
     * @param content 消息内容,支持html 或 url
     * @param wid 宽度 选填
     * @param height 高度 选填
     * @return 返回窗口ID
     */
    this.custom = function(type,title,content,wid,hei){}

    /*
     * 打开加载层
     * @return 返回窗口ID
     */
    this.loadOpen = function(content){}

    /*
     * 关闭加载层
     * @param win 窗口ID
     * @return 无返回
     */
    this.loadClose = function(win){}

    /*
     * 关闭弹出层
     * @param win 窗口ID
     * @return 无返回
     */
    this.close = function(win){}
}

if (msgPlugin == 'layer') {
	if (isMobile) {
		LayerH5Msg.prototype = new BaseMsg();
　　	LayerH5Msg.prototype.constructor = LayerH5Msg;
        //xs是迅尚的命名空间的含义，但为了分文件管理的方便，所以在xs的基础上增加了msg，合并为xsmsg，将其定义为迅尚提示消息的命名空间。
　　	var xsmsg = new LayerH5Msg();
	} else {
	    LayerPCMsg.prototype = new BaseMsg();
　　	LayerPCMsg.prototype.constructor = LayerPCMsg;
　　	var xsmsg = new LayerPCMsg();
	}
} else if (msgPlugin == 'custom') {
	CustomMsg.prototype = new BaseMsg();
	CustomMsg.prototype.constructor = CustomMsg;
　　var xsmsg = new CustomMsg();
}

//* @param msgtype 消息类型，info：提示【默认】；warn:警告；success：正确、成功；error：错误、失败；yesno：判断

//存储不同类型对应的icon值
var tipType = {
	'info':'0',
    'warn':'0',
    'success':'1',
    'error':'2',
    'yesno':'3',
};
//存储不同类型对应的按钮
var btnType = {
	'info':['确定'],
    'warn':['确定'],
    'success':['确定'],
    'error':['确定'],
    'yesno':['确定','取消'],
};

/*
* layer方式的PC弹窗
*/
function LayerPCMsg(){
    var isIE = /msie/i.test(ua) && !window.opera; //获取是否是ie浏览器

    //普通提示框
    this.msg = function(content,msgtype,fn){
        if (msgtype === undefined) { 
            layer.msg(content);
        } else{
            layer.open({
                icon: tipType[msgtype],
                title: '系统提示',
                content: content,
                btn: btnType[msgtype],
                btnAlign: 'c',     //按钮居中
                shade: 0.1,
                yes: function(index){
                    var ret;
                    if (typeof(fn) === "string" && fn != "") {
                        ret = eval(fn);
                    }
                    layer.close(index);
                },
                cancel: function(index){
                    var ret;
                    if (typeof(fn) === "string" && fn != "") {
                        ret = eval(fn);
                    }
                    layer.close(index);
                }
            });
        }
    }
	
	//判断框
    this.yesNo = function(content,fn){
		layer.open({
            icon: tipType['yesno'],
            title: '系统提示',
            content: content,
            btn: btnType['yesno'],
            btnAlign: 'c',     //按钮居中
            shade: 0.1,
            yes: function(index){
				var ret;
				if (typeof(fn) === "string" && fn != "") {
					ret = eval(fn);
				}
                layer.close(index);
            }
        });
	}

    //退出弹框
    this.quit = function(url){
        layer.open({
            icon: tipType['yesno'],
            title: '系统提示',
            content: '是否退出？',
            btn: btnType['yesno'],
            btnAlign: 'c', 
            shade: 0.1,    
            yes: function(){
                window.location.href = url; 
            }
        });
    }

    //tip弹框
    this.tip = function(obj,content,direction,color){
        var tip;
        $(obj).hover(function(){
            tip = layer.tips(content, this, {
                tips: [direction, color]
            });
        },function(){
            layer.close(tip);
        });
    }

    //自定义弹框
    this.custom = function(type,title,content,wid,hei){
        if(type == 1){
            return layer.open({
                type: type,
                title: title,
                content: content,
                btn: 0,
                shade: 0.1,    
                area: ['auto']
            });
        } else{
            return layer.open({
                type: type,
                title: title,
                content: content,
                btn: 0,
                shade: 0.1,    
                area: [wid,hei]
            });
        }
    }

    //加载层
    this.loadOpen = function(){
        return layer.load(2, {
            shade: [0.1,'#000'] //0.1透明度的白色背景
        });
    }

    //关闭加载层
    this.loadClose = function(win){
        layer.close(win);
    }

    //关闭弹出层
    this.close = function(win){
        layer.close(win);
    }
}

/*
* layer方式的mobile弹窗
*/
function LayerH5Msg(){
	//普通提示框
    this.msg = function(content,msgtype,fn){
        if (msgtype === undefined) { 
            layer.open({
                content: content,
                skin: 'msg',
                //skin: 'footer',  //ios式底部提示
                time: 1.5,
                shade: 'background-color: rgba(0,0,0,.3)', 
            });
        } else{
            layer.open({
                content: content,
                btn: btnType[msgtype],
                shade: 'background-color: rgba(0,0,0,.3)', 
                yes: function(index){
                    var ret;
                    if (typeof(fn) === "string" && fn != "") {
                        ret = eval(fn);
                    }
                    layer.close(index);
                }
            });
        }
    }

	//判断框
    this.yesNo = function(content,fn){
		layer.open({
            content: content,
            btn: btnType['yesno'],
            shade: 'background-color: rgba(0,0,0,.3)', 
            yes: function(index){
				var ret;
				if (typeof(fn) === "string" && fn != "") {
					ret = eval(fn);
				}
                layer.close(index);
            }
        });
	}

    //退出弹框
    this.quit = function(url){
        layer.open({
            content: '是否退出？',
            btn: btnType['yesno'],
            shade: 'background-color: rgba(0,0,0,.3)',
            yes: function(){
                window.location.href = url;
            }
        });
    }

    //自定义弹框
    this.custom = function(type,title,content,wid,hei){
        if(type == 1){
            return layer.open({
                type: type,
                title: title,
                content: content,
                btn: 0,
                shade: 0.1,    
                area: ['auto']
            });
        } else{
            return layer.open({
                type: type,
                title: title,
                content: content,
                btn: 0,
                shade: 0.1,    
                area: [wid,hei]
            });
        }
    }

    //加载层
    this.loadOpen = function(content){
        return layer.open({
            type: 2,
            content: content
        });
    }

    //关闭加载层
    this.loadClose = function(win){
        layer.close(win);
    }

    //关闭弹出层
    this.close = function(win){
        layer.close(win);
    }
}