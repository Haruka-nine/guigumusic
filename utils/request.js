//发送ajax请求
/**
 * 1.封装功能函数
 *   1.功能点明确
 *   2.函数内部应该保留固定代码(静态的)
 *   3.将动态的数据抽取成形参，由使用者根据自身的情况动态的传入实参
 * 2.封装功能组件
 *   1.功能点明确
 *   2.组件内部保留静态的代码
 *   3.将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式传入pros数据
 *   4.一个良好的组件应该设置组件的必要性及数据类型
 *
 */
import config from "./config";
export default (url,data={},method='GET')=>{
    return new Promise((resolve, reject)=>{
        //1.new promise 初始化promise实例的状态为pending
        wx.request({
            url:config.host+url,
            data,
            header:{
                Cookie: 'MUSIC_U='+wx.getStorageSync('cookies')
            },
            method,
            success:(res)=>{
                // console.log('请求成功',res)
                if (data.isLogin){
                    wx.setStorage({
                        key:'cookies',
                        data:res.data.token
                    })
                }
                resolve(res.data)
            },
            fail:(err)=>{
                // console.log('请求失败',err)
                reject(err)
            }
        })
    })

}
