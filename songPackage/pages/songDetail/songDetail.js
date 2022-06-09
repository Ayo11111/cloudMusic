import PubSub from 'pubsub-js'
import request from '../../../utils/reques'
import moment from 'moment'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentSong: {},
    musicId: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
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
      let durationTime = moment(data.data.duration).format('mm:ss')
      this.setData({
        currentSong: data.data,
        musicId: data.data.id,
        durationTime
      })
      // 动态的设置导航栏的标题
      wx.setNavigationBarTitle({
        title: data.data.name
      })
    })

    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay: true
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

    // 当音频结束以后
    this.BackgroundAudioManager.onEnded(() => {
      // 发布消息，随后走播放流程
      PubSub.publish('switchType', 'next')
      this.audioDataUpDate(true)
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })

    this.BackgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  // 切换歌曲按钮
  handleSwitch(event) {
    let type = event.target.id

    // 切换歌曲之前，先关闭上一首播放歌曲
    this.BackgroundAudioManager.stop() // 停止音乐

    // 订阅来自recommendSong页面的数据(订阅必须放在回传信息之前)
    PubSub.subscribe('toggle', (_, musicMsg) => {
      let durationTime = moment(musicMsg.duration).format('mm:ss')
      //  这个回调才是这个函数最后的执行的地方
      this.setData({
        currentSong: musicMsg,
        durationTime
      })

      wx.setNavigationBarTitle({
        title: musicMsg.name
      })

      this.musicControl(true)
      // 取消订阅(因为底层实现原因，订阅是会累加的，所以要取消，要不就不要放在这里)
      PubSub.unsubscribe()
    })

    // 发布消息
    PubSub.publish('switchType', type)

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
    this.musicControl(this.data.isPlay, this.musicLink)
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