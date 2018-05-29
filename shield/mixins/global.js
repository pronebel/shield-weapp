
export let navbar = {
  set title(value){
    wx.setNavigationBarTitle({
      title: value
    })
  }
}