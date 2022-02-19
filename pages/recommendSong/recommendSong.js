import PubSub from 'pubsub-js'
import request from '../../utils/reques'
import showToast from '../../utils/selfUtils'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        listData: [],
        index: 0 // 当前播放歌曲的索引
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 如果没有用户数据，那么就跳回登录页
        let usersInfo = wx.getStorageSync('userInfo')
        if (!usersInfo) {
            showToast('请登录', 'error', function () {
                wx.reLaunch({
                    url: '/pages/login/login',
                })
            })
        }

        this.setData({
            day: new Date().getDate(), //getDate(一个月中的某一天) getDay(一个星期中的某一天)
            month: new Date().getMonth() + 1
        })
        this.getListData()

        // 订阅消息
        PubSub.subscribe('switchType', (_, type) => {
            let { listData, index } = this.data
            if (type === 'pre') {
                index === 0 && (index = listData.length)
                this.setData({
                    index: index -= 1
                })

            } else {
                index === listData.length - 1 && (index = -1)
                this.setData({
                    index: index += 1
                })
            }
            // console.log(index);
            let musicMsg = listData[index]
            PubSub.publish('toggle', musicMsg)
        })

    },

    // 获取列表数据
    async getListData() {
        let ListData = await request('/recommend/songs')
        this.setData({
            listData: ListData.recommend
        })
    },

    // 页面跳转
    toSongDetail(event) {
        let { songdetail, index } = event.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/pages/songDetail/songDetail?test=1',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: songdetail })
            }
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
        // console.log(getCurrentPages());
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