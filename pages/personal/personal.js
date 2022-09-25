import request from "../../utils/request";

let startY = 0  //手指起始的坐标
let moveY = 0  //手指移动的坐标
let moveDistance = 0  //手指移动的距离

Page({
    data: {
        coverTransform:'translateY(0rpx)',
        coverTransition:'',
        userInfo:{},
        isShow:false,
        recentPlayList:[], //用户播放记录
    },
    onLoad: function (options) {
        //读取用户的基本信息
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo){
            this.setData({
                userInfo:JSON.parse(userInfo)
            })
            //获取用户播放记录
            this.getUserRecentPlayList(this.data.userInfo.userId)

        }
        if (Object.keys(this.data.userInfo).length>0){
            this.setData({
                isShow:true
            })
        }
    },
    //获取用户播放记录的功能函数
    async getUserRecentPlayList(userId){
        let recentPlayListData = await request('/user/record',{uid:userId,type:1})
        this.setData({
            recentPlayList:recentPlayListData.weekData.splice(0,10)
        })
    },
    handleTouchStart(event){
        this.setData({
            coverTransition:''
        })
        startY = event.touches[0].clientY

    },
    handleTouchMove(event){
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY
        if (moveDistance<=0){
            return
        }
        if (moveDistance>=80){
            moveDistance=80
        }
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd(){
        this.setData({
            coverTransform:`translateY(0rpx)`
        })
        this.setData({
            coverTransition:'transform 1s linear'
        })
    },

    //跳转至登陆界面的回调
    toLogin(){
        wx.navigateTo({
            url:'/pages/login/login'
        })
    }
});
