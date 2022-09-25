import request from "../../utils/request";
import PubSub from 'pubsub-js'
Page({
    data: {
        day:'', //天
        month:'', //月
        dailySongs:[], //每日推荐列表
        index:0,
    },
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo){
            wx.showToast({
                title:'请先登陆',
                icon:'none',
                success:()=>{
                    wx.reLaunch({
                        url:'/pages/login/login'
                    })
                }
            })
        }
        //更新日期的状态数据
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1
        })

        //获取每日推荐的数据
        request('/recommend/songs').then(res=>{
            // console.log(res)
            this.setData({
                dailySongs:res.data.dailySongs
            })
        })

        PubSub.subscribe('switchType',(msg,data)=>{
            let {dailySongs,index} = this.data
            if (data === 'pre'){
                //上一首
                index = index-1
            }else {
                //下一首
                index = index+1
            }
            if (index<0){
                index=dailySongs.length-1
            }
            if (index === dailySongs.length)
            {
                index=0
            }
            //更新下标
            this.setData({
                index
            })
            let musicId = dailySongs[index].id
            //将musicId提供给详情页面
            PubSub.publish('musicId',musicId)
        })

    },
    toSongDetail(event){
        let id = event.currentTarget.dataset.song.id
        let index = event.currentTarget.dataset.index
        this.setData({
            index
        })
        //路由跳转传参： query参数
        wx.navigateTo({
            url:'/pages/songDetail/songDetail?id='+id
        })
    },

    onUnload() {
        PubSub.unsubscribe('switchType')
    }

});
