import request from "../../utils/request";
Page({
    data: {
        videoGroupList:[], //导航标签数据
        navId:'',
        videoList:[],//视频的列表数据,
        videoId:'', //视频标识
        videoUpdateTime:[], //记录video播放的时长
        isTriggered:false, //标志下拉刷新是否被触发
    },
    onLoad: function (options) {
        if (!wx.getStorageSync('cookies')){
            wx.navigateTo({
                url:'/pages/login/login'
            })
        }
        this.getVideoGroupListData().then(res=>{
            this.getVideoList(this.data.navId)
        })

    },
    //监听视频播放进度的回调
    handleTimeUpdate(event){
        let videoTimeObj = {
            vid:event.currentTarget.id,
            currentTime:event.detail.currentTime
        }
        let videoUpdateTime = this.data.videoUpdateTime
        //判断记录播放时长的videoUpdateTime数组中是否有当前视频
        //如果有，需要在原有的播放记录中修改播放时间为当前的播放时间
        //如果没有，需要在数组中添加当前视频的播放对象
        let videoItem = videoUpdateTime.find(item=>item.vid === videoTimeObj.vid)
        if (videoItem){
            videoItem.currentTime = event.detail.currentTime
        }else {
            videoUpdateTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdateTime
        })
    },
    //获取导航数据
    async getVideoGroupListData(){
        let videoGroupListData = await request('/video/group/list');
        if (videoGroupListData.data.length>0){
            this.setData({
                videoGroupList :videoGroupListData.data.slice(0,14)
            })
            this.setData({
                navId:this.data.videoGroupList[0].id
            })
        }

    },

    //点击播放/继续播放的回调
    handlePlay(event){
        /**
         * 需求
         * 1.在点击播放的事件中需要找到一个播放的视频
         * 2.在播放新的视频时需要关闭上一个视频
         */
        //创建控制video标签的实例对象
        let vid = event.currentTarget.id
        // if (this.vid&&this.vid!==vid&&this.videoContext){
        //     this.videoContext.stop();
        // }
        // this.vid = vid
        //更新data中videoId的数据
        this.setData({
            videoId:vid
        })
        // this.videoContext = wx.createVideoContext(vid)
        // this.videoContext.play()
        //判断当前的视频是否播放过，是否有播放记录，如果有，跳转至指定的播放位置
        this.videoContext = wx.createVideoContext(vid)
        let videoUpdateTime = this.data.videoUpdateTime
        let videoItem = videoUpdateTime.find(item=>item.vid===vid)
        if (videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }

    },
    //自定义下拉刷新的回调
    handleRefresher(event){
        //所谓下拉刷新就是发请求，获取最新的列表数据
        this.getVideoList(this.data.navId).then(res=>{
            this.setData({
                isTriggered:false
            })
        })
    },
    //上拉触底
    handleToLower(){
        console.log('上拉触底')
        console.log('发送请求||在前端截取最新的数据 追加到视频列表的后方')
    },
    //视频播放结束调用
    handleEnded(event){
        let videoUpdateTime = this.data.videoUpdateTime
        videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1)
        this.setData({
            videoUpdateTime
        })
    },
    //获取视频列表数据
    async getVideoList(navId){
        let videoListData = await request('/video/group',{id:navId})
        if (videoListData.hasmore){
            let index = 0
            let videoList = videoListData.datas.map(item =>{
                item.id = index++
                return item
            })
            //URL列表
            let videoUrlList = []
            //获取url
            for (let i = 0; i < videoList.length; i++){
                let videoUrlItem = await request('/video/url',{id:videoList[i].data.vid})
                videoUrlList.push(videoUrlItem.urls[0].url)
            }
            // 将Url导入进videoList中
            for (let i = 0; i < videoUrlList.length; i++) {
                videoList[i].data.urlInfo = videoUrlList[i]
            }
            this.setData({
                videoList
            })
        }else {
            wx.showToast({
                title: '此标签暂无推荐视频',
                icon: 'none',
                duration: 2000
            })
        }

    },

    //点击切换导航的回调
    changeNav(event){
        let navId = event.currentTarget.id
        this.setData({
            navId:navId*1,
            videoList:[]
        })
        //显示正在加载
        wx.showLoading({
            title:'正在加载'
        })
        this.getVideoList(navId).then(res=>{
            wx.hideLoading()
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        console.log('页面的下拉刷新')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log('页面的下拉刷新')
    },

    onShareAppMessage({from}) {
        return{
            title:'自定义转发路径',
            page:'/page/video/video',
            imageUrl:'https://haruka.obs.cn-east-2.myhuaweicloud.com/_cover.jpg'
        }
    },
    //跳转至搜索界面
    toSearch(){
        wx.navigateTo({
            url:'/pages/search/search'
        })
    }
});
