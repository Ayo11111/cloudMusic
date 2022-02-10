import request from '../../utils/reques'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentSong: {},
    musicId: ''
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
      this.setData({
        currentSong: data.data,
        musicId: data.data.id
      })
      // 动态的设置导航栏的标题
      wx.setNavigationBarTitle({
        title: data.data.name
      })
    })

    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay:true
      })
    }

    /* 
      问题: 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致

    */
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()

    this.BackgroundAudioManager.onPlay(() => {
      this.audioDataUpDate(true)
      appInstance.globalData.musicId = this.data.musicId
    })

    this.BackgroundAudioManager.onPause(() => {
      this.audioDataUpDate(false)
    })

    this.BackgroundAudioManager.onStop(() => {
      this.audioDataUpDate(false)
    })
  },

  // 更新播放状态的函数
  audioDataUpDate(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
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
    if (isPlay) {
      const { currentSong } = this.data
      let musicUrl = await request('/song/url', { id: currentSong.id })
      this.BackgroundAudioManager.title = currentSong.name
      this.BackgroundAudioManager.src = musicUrl.data[0].url
    } else {
      this.BackgroundAudioManager.pause()
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