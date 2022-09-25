import request from "../../utils/request";
import utils from "../../utils/utils";
let isSend = false
Page({
    data: {
        placeholderContent:'', //placeholder的内容
        hotList:[],//热搜榜
        searchContent:'',//用户输入的表单项数据
        searchList:[] ,//关键字模糊匹配的数据
        historyList:[],//历史记录初始化数组
    },
    onLoad: function (options) {
        this.getInitData()
        this.getSearchHistory()
    },
    //获取初始化数据
    async getInitData(){
        let placeholderContent = await request('/search/default');
        let hotListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent : placeholderContent.data.showKeyword,
            hotList:hotListData.data
        })
    },

    //函数防抖
    //表单项内容发生改变的回调
    handleInputChange : utils.debounce_1(function (event){
        this.setData({
            searchContent:event.detail.value
        })
        if (!this.data.searchContent){
            this.setData({
                searchList:[]
            })
            return
        }
        request('/search',{keywords:this.data.searchContent,limit:10}).then(res=>{
            this.setData({
                searchList:res.result.songs
            })
            //将搜索历史添加到搜索记录中
            let {searchContent,historyList} = this.data;
            if (historyList.indexOf(searchContent) !==-1){
                historyList.splice(historyList.indexOf(searchContent),1)
            }
            historyList.unshift(searchContent);
            this.setData({
                historyList
            })
            wx.setStorageSync('searchHistory',historyList)
        })
    },300),

    //获取本地历史记录的功能函数
    getSearchHistory(){
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList){
            this.setData({
                historyList
            })
        }
    },
    //清空收缩框
    clearSearchContent(){
        this.setData({
            searchContent:'',
            searchList:[]
        })
    },
    //删除历史记录
    deleteSearchHistory(){
        wx.showModal({
            content:'确认删除吗?',
            success:(res)=>{
                if (res.confirm){
                    this.setData({
                        historyList:[]
                    })
                    //移除本地的历史记录缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
        })

    }
});
