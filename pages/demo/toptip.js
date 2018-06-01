// pages/demo/toptip.js
import { TopTip} from '../../components/index.js'
import WxApp from '../../shield/component/index.js'
import VueDemo from './vue.js'

Page({
  $type: 'page',
  ...TopTip,
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  showTip(){
    this.showSimTopTip("fdddd",{
      type:'success'
    })
  },
  components: {},
  onLoad: function (options) {
    this.components = {
      TopPage: new WxApp.Component('TopPage', VueDemo, this),
    }
    console.log('Inject Components', this.components.TopPage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },



})