import request from '../../utils/reques'
let isSend = false // 函数节流使用
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    sendData: '', // 搜索框发送接口数据
    searchList: [],
    historyList:[] // 存放历史记录信息的数组
  },

  // 初始化placeholder数据
  async getInitPlaceholder() {
    const placeholderData = await request('/search/default')
    const hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  // 搜索框事件回调
  inputHandle(e) {
    this.setData({
      sendData: e.detail.value
    })

    if (!this.data.sendData) {
      this.setData({
        searchList: []
      })
      return
    }

    if (isSend) {
      return
    }
    this.getSearchList()
    isSend = true
    this.setTimeoutId = setTimeout(() => {
      isSend = false
    }, 500)
  },

  // 删除历史记录图标回调
  deleteHistory() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除历史记录吗',
      success (res) {
        if (res.confirm) {
          that.setData({
            historyList:[]
          })
          wx.removeStorageSync('historyList')
        }
      }
    })
  },

  // 删除搜索内容事件
  deleteSearchContent() {
    this.setData({
      sendData:'',
      searchList:[]
    })
  },

  // 从本地缓存拿到搜索历史信息
  getHistoryList() {
    let historyList = wx.getStorageSync('historyList')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 搜索框模糊搜索接口请求
  async getSearchList() {
    let {historyList,sendData} = this.data
    const searchListData = await request('/search', { keywords:sendData, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
    })

    if (historyList.indexOf(sendData) !== -1) {
      historyList.splice(historyList.indexOf(sendData),1)
    }
    historyList.unshift(sendData)
    this.setData({
      historyList
    })
    
    wx.setStorageSync('historyList', historyList)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化placeholder的内容
    this.getInitPlaceholder()

    // 初始化搜索历史的内容
    this.getHistoryList()
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