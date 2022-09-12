/**
 * 登陆流程
 * 1.收集表单项数据
 * 2.前端验证
 *  （1）验证用户信息（账户，密码）是否合法
 *  （2）前端不通过就提示用户，不需要发请求给后端
 *  （3）前端验证通过了,发请求（携带账户，密码）给服务器端
 * 3.后端验证
 */
import request from "../../utils/request";
Page({
    data: {
        phone:'', //手机号
        password:'' //密码
    },
    onLoad: function (options) {

    },

    //表单项内容发生改变的回调
    handleInput(event){
        this.setData({
            [event.currentTarget.id]:event.detail.value
        })
    },

    //登陆的回调
    async login(){
        //1.收集表单项的数据
        let {phone,password} = this.data
        //2.前端杨正
        /**
         * 手机号验证：
         *  1.内容为空
         *  2.手机号格式不正确
         *  3.手机号格式正确，验证通过
         */
        if (!phone){
            wx.showToast({
                title:'手机号不能为空',
                icon:'none'
            })
            return;
        }
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if (!phoneReg.test(phone)){
            wx.showToast({
                title:'手机号格式错误',
                icon:'none'
            })
            return;
        }
        if (!password){
            wx.showToast({
                title:'密码不能为空',
                icon:'none'
            })
            return;
        }
        // wx.showToast({
        //     title:'前端验证通过',
        //     icon:'success'
        // })
        let result = await request('/login/cellphone',{phone,password})
        if (result.code===200){
            //登陆成功
            wx.showToast({
                title:'登陆成功'
            })
            //将用户的信息存储至本地
            wx.setStorageSync('userInfo',JSON.stringify(result.profile))
            //跳转至个人中心personal页面
            wx.reLaunch({
                url:'/pages/personal/personal'
            })
        }else if (result.code ===400){
            wx.showToast({
                title:'手机号错误',
                icon:'none'
            })
        }else if (result.code ===502){
            wx.showToast({
                title:'密码或账号错误',
                icon:'none'
            })
        }else {
            wx.showToast({
                title:'登陆失败',
                icon:'none'
            })
        }
    }
});
