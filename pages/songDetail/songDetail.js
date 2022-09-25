import request from "../../utils/request";
import utils from "../../utils/utils";
import dayjs from "dayjs";
import PubSub from 'pubsub-js'
//获取全局实例
const appInstance = getApp()
Page({
    data: {
        isPlay:false, //音乐是否播放
        id:'',
        song:{},
        currentTime:'00:00',
        durationTime:'00:00',
        currentWidth:0
    },
    onLoad: function (options) {
        this.setData({
            id:options.id
        })

        this.backgroundAudioManager =  wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(()=>{
            this.setData({
                isPlay:true
            })

        })
        this.backgroundAudioManager.onPause(()=>{
            this.setData({
                isPlay:false
            })
        })
        this.backgroundAudioManager.onStop(()=>{
            this.setData({
                isPlay:false
            })
        })
        //监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(()=>{
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime:dayjs(this.backgroundAudioManager.currentTime*1000).format('mm:ss'),
                currentWidth
            })
        })

        //监听音乐播放自然结束
        this.backgroundAudioManager.onEnded(()=>{
            //自动播放至下一首音乐
            PubSub.publish('switchType','next')
            //进度条还原为0
            this.setData({
                currentTime:'00:00',
                currentWidth:0
            })
        })
        this.getMusicInfo(options.id)
        PubSub.subscribe('musicId',(msg,musicId)=>{
            this.setData({
                id:musicId
            })
            this.getMusicInfo(musicId)
        })

    },
    //节流调用
    thHandle: utils.throttle(function (){
        this.handleMusicPlay()
    },500),
    //播放/暂停的回调
    handleMusicPlay(){
        let isPlay = !this.data.isPlay
        //这里不需要再重复修改播放状态，因为下方的播放会触发监听，监听会进行修改
        //但不在这里设置的话，就会导致按钮变化慢一步，但在这里设置就会导致点击过快有问题(推荐使用节流)
        this.setData({
            isPlay
        })
        let id = this.data.id
        this.musicControl(isPlay,id)
    },
    //控制音乐播放/暂停的功能函数
    musicControl(isPlay) {
        if (isPlay) {
            //音乐播放
            this.backgroundAudioManager.play()
        } else {
            //音乐暂停
            this.backgroundAudioManager.pause()

        }
    },
    //获取音乐详情的功能函数
    getMusicInfo(id){
        request('/song/detail',{ids:id}).then(res=>{
            this.setData({
                song:res.songs[0]
            })
            let durationTime = dayjs(res.songs[0].dt).format('mm:ss')
            this.setData({
                durationTime
            })
            //动态修改窗口标题
            wx.setNavigationBarTitle({
                title:this.data.song.name
            })
            //获取音乐的播放链接
            request('/song/url',{id:id}).then(res=>{
                let musicLink = res.data[0].url
                this.setData({
                    musicLink
                })
                //只设置src并不会播放,还需要设置title
                this.backgroundAudioManager.title = this.data.song.name
                //创建控制音乐播放的实例
                this.backgroundAudioManager.src = this.data.musicLink
                this.backgroundAudioManager.play()
                this.setData({
                    isPlay:true
                })
            })
        })
    },

    //点击切歌的回调
    handSwitch(event){
        let type = event.currentTarget.id
        PubSub.publish('switchType',type)
    },
    onUnload() {
        PubSub.unsubscribe('musicId')
    }

});
