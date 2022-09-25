Page({
    data: {
        person:{
            username:'curry',
            age:33
        }
    },
    onLoad: function (options) {

    },
    /*获取用户openId的回调*/
    handGetOpenId(){
        //获取登陆凭证
        wx.login({
            success:(res)=>{
                let code = res.code
            }
        })
        //将登陆凭证发送给服务器
    }
});
