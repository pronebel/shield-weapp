export let toast = {
  show (title, options = {icon:"none"}) {
    options.title = title

    wx.showToast(options)

  },
  success(title, options = { icon: "success" }) {
    options.title = title

    wx.showToast(options)

  },
  close () {
    wx.hideToast()
  }
}
export let loading = {
  show (title = '加载中', options = {}) {
    options.title = title
    wx.showLoading(options)
  },
  close () {
    wx.hideLoading()
  }
}

export let dialog = {
  alert (content, options = {}) {
    options.title = options.title|| '提示'
    options.content = content
    options.showCancel = false
    wx.showModal(options)
  },
  confirm (content, options = {}) {
    options.title = options.title ||'提示'
    options.content = content
    options.showCancel = true
    wx.showModal(options)
  }
}

export let changeNavBar={
  color(frontColor,backColor){
    wx.setNavigationBarColor({
      frontColor: frontColor,
      backgroundColor: backColor,
    })
  }
}
