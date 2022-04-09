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

  // 搜索框模糊搜索接口请求
  async getSearchList() {
    const searchListData = await request('/search', { keywords: this.data.sendData, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitPlaceholder()
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