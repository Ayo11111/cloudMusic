// pages/login/login.js
import request from '../../utils/reques'
import { validationTips } from '../../utils/selfUtils'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: ''
    },

    async login() {
        let { phone, password } = this.data
        // 前端验证
        if (!phone) {
            validationTips('手机号不能为空', 'error')
            return
        }
        let phoneReg = /^1[3-9]\d{9}$/
        if (!phoneReg.test(phone)) {
            validationTips('手机号格式错误', 'error')
            return
        }
        if (!password) {
            validationTips('密码不能为空', 'error')
            return
        }

        // 后端验证
        let results = await request('/login/cellphone', { phone, password, isLogin:true})
        if (results.code === 200) {
            validationTips('登录成功')
            wx.setStorageSync('userInfo', results.profile)

            wx.switchTab({
              url: '/pages/personal/personal',
            })
        } else if (results.code === 502) {
            validationTips('密码错误', 'error')
        } else {
            validationTips('登录失败，请重试', 'error')
        }
    },

    handleInput(event) {
        // let type = event.target.id //这种id传参的方式可以在传全局唯一的标识的情况下使用
        let type = event.target.dataset.type // 这种data-key=value的形式可以同时传多个
        this.setData({
            [type]: event.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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