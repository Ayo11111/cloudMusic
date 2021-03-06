let startY = 0 // 手指起始的坐标
let moveY = 0  // 手指移动的坐标 
let moveDistance = 0 //手指移动的距离
import request from '../../utils/reques'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0)',
        coveTransition: '',
        userInfo: {},
        recentPlayList: {} //最近播放记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo
            })
            this.getRecentPlayList(this.data.userInfo.userId)
        }
    },

    async getRecentPlayList(userId) {
        let recentPlayList = await request('/user/record', { uid: userId, type: 1 })
        this.setData({
            recentPlayList: recentPlayList.weekData
        })
    },

    // 手指点击时的回调
    handleTouchStart(event) {
        this.setData({
            coveTransition: ''
        })
        // 获取手指的起始坐标
        startY = event.touches[0].clientY
    },

    // 手指移动时的回调
    handleTouchMove(event) {
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY

        if (moveDistance <= 0) {
            return
        }

        if (moveDistance >= 80) {
            moveDistance = 80
        }

        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },

    // 手指离开时的回调
    handleTouchEnd() {
        this.setData({
            coverTransform: 'translateY(0)',
            coveTransition: 'transform 1s linear'
        })
    },

    // 去登录页
    toLogin() {
        wx.redirectTo({
            url: '/pages/login/login'
        })
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

    }
})