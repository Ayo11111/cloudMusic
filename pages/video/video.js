import request from '../../utils/reques'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], // 导航条数据
        navId: '',
        videoList: [],
        videoId: '',
        videoUpdateTime: [] // 存放视频存在数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getVideoGroupList()
    },

    // 点击播放和继续播放的回调
    handlePlay(event) {
        /* 单例模式：
    *   1. 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，
    *   2. 节省内存空间 
    *   */
        let vid = event.currentTarget.id

        // this.vid !== vid && this.videoContext && this.videoContext.stop()

        // 创建控制video的实例对象
        this.videoContext = wx.createVideoContext(vid)
        this.setData({
            videoId: vid
        })
        // this.vid = vid

    },

    // 视频播放过程中的回调
    handleUpdate(event) {
        let upDateObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }
        let { videoUpdateTime } = this.data
        /*
            判断之前有没有播放记录

            这里就反应出 fine() 方法返回的结果内存指向依然是 原数组里对象 所指向的内存地址
            所有这里返回的是浅拷贝的数据
        */
        let videoItem = videoUpdateTime.find(item => item.vid === upDateObj.vid)
        if (videoItem) {
            videoItem.currentTime = event.detail.currentTime
        } else {
            videoUpdateTime.push(upDateObj)
        }

        this.setData({
            videoUpdateTime
        })
    },

    // 视频播放结束时的回调
    handleEnd(event) {
        let { videoUpdateTime } = this.data
        videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    },

    // 获取数据
    async getVideoGroupList() {
        let videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            // 默认选中第一个导航
            navId: videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.navId)
    },

    // 获取视频导航数据
    async getVideoList(navId) {
        let videoList = await request('/video/group', { id: navId })
        this.setData({
            videoList: videoList.datas
        })
        // 取消loading
        wx.hideLoading()
    },

    // 导航点击事件，动态绑定类名
    navTap(event) {
        this.setData({
            navId: event.currentTarget.dataset.id,
            // 清空当前数据，以免在加载过程中显示旧数据
            videoList: []
        })
        // 展示loading
        wx.showLoading({
            title: '正在加载中',
        })
        this.getVideoList(this.data.navId)
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