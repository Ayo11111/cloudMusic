import request from '../../utils/reques'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentSong: {},
    durationTime: '00:00',
    currentTime: '00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 路径传参，不过长度有限制，且放在路径里的参数都会变成字符串传过来
    console.log(options.test);

    // 自定义传参，无那么多限制，详情可以去看官网Api或者去recommendSong.js里是如何传参的
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data);
      let durtationTime = data.data.duration
      this.setData({
        currentSong: data.data,
        durtationTime
      })
      // 动态的设置导航栏的标题
      wx.setNavigationBarTitle({
        title: data.data.name
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 控制音乐是否播放
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })
    this.musicControl(this.data.isPlay)
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay) {
    let BackgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlay) {
      const { currentSong } = this.data
      let musicUrl = await request('/song/url', { id: currentSong.id })
      BackgroundAudioManager.title = currentSong.name
      BackgroundAudioManager.src = musicUrl.data[0].url
    } else {
      BackgroundAudioManager.pause()
    }
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