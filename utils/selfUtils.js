// 提示函数
export function validationTips(title, icon = 'sucess', success = () => {}) {
  wx.showToast({
    title,
    icon,
    success
  })
}