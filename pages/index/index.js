var app = getApp()
// pages/index/index.js
import request from '../../utils/reques'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [], //轮播图数据
        recommendSongs: [], //推荐歌曲数据
        topList: [] //排行榜数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.requestFun()
    },

    toRecommendSong(){
        wx.navigateTo({
          url: '/pages/recommendSong/recommendSong',
        })
    },

    // 发送请求的接口
    async requestFun() {
        // 轮播图请求接口
        let { banners } = await request('/banner', { type: 2 })
        this.setData({
            banners: banners
        })

        // 获取推荐歌单数据
        let { result } = await request('/personalized', { limit: 20 })
        this.setData({
            recommendSongs: result
        })

        // 获取排行榜数据
        let list = []
        for (let index = 0; index < 5; index++) {
            let { playlist } = await request('/top/list', { idx: index })
            let playListItem = { name: playlist.name, tracks: playlist.tracks.slice(0, 3) }
            list.push(playListItem)

            // 放在里面就不会长时间白屏，不过会牺牲性能多次渲染
            this.setData({
                topList: list
            })
        }
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    toCurrPage(url) {

    }
})