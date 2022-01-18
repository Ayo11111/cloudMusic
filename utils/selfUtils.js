  // 提示函数
export function validationTips(title, icon = 'sucess') {
    wx.showToast({
        title,
        icon
    })
}