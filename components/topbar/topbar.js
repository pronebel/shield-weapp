// components/topbar/topbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navbarArray: [{
      text: '推荐',
    }, {
      text: '热点',
    }, {
      text: '视频',
    }, {
      text: '图片',
    }, {
      text: '段子',
    }, {
      text: '社会',
    }, {
      text: '娱乐',
    }, {
      text: '科技',
    }, {
      text: '体育',
    }, {
      text: '汽车',
    }, {
      text: '财经',
    }, {
      text: '搞笑',
      
    }],
    navbarShowIndexArray: Array.from(Array(12).keys()),
    navbarHideIndexArray: [],
    windowWidth: 375,
    scrollNavbarLeft: 0,
    currentChannelIndex: 0,
    startTouchs: {
      x: 0,
      y: 0
    },
    channelSettingShow: '',
    channelSettingModalShow: '',
    channelSettingModalHide: true,
    articlesHide: false,
    articleContent: '',
    loadingModalHide: false
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapNavbar: function (e) {
      this.switchChannel(parseInt(e.currentTarget.id));
    },
    switchChannel: function (targetChannelIndex) {
      this.getArticles(targetChannelIndex);
      console.log(targetChannelIndex)
      this.setData({
        currentChannelIndex: targetChannelIndex
      });
    },
    getArticles: function (index) {
      this.setData({
        loadingModalHide: false,
        articleContent: ''
      });
      setTimeout(() => {
        this.setData({
          loadingModalHide: true,
          articleContent: this.data.navbarArray[index].text
        });
      }, 500);
    },
    onTouchstartArticles: function (e) {
      this.setData({
        'startTouchs.x': e.changedTouches[0].clientX,
        'startTouchs.y': e.changedTouches[0].clientY
      });
    },
    onTouchendArticles: function (e) {
      let deltaX = e.changedTouches[0].clientX - this.data.startTouchs.x;
      let deltaY = e.changedTouches[0].clientY - this.data.startTouchs.y;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        let deltaNavbarIndex = deltaX > 0 ? -1 : 1;
        let currentChannelIndex = this.data.currentChannelIndex;
        let navbarShowIndexArray = this.data.navbarShowIndexArray;
        let targetChannelIndexOfNavbarShowIndexArray = navbarShowIndexArray.indexOf(currentChannelIndex) + deltaNavbarIndex;
        let navbarShowIndexArrayLength = navbarShowIndexArray.length;
        if (targetChannelIndexOfNavbarShowIndexArray >= 0 && targetChannelIndexOfNavbarShowIndexArray <= navbarShowIndexArrayLength - 1) {
          let targetChannelIndex = navbarShowIndexArray[targetChannelIndexOfNavbarShowIndexArray];
          if (navbarShowIndexArrayLength > 6) {
            let scrollNavbarLeft;
            if (targetChannelIndexOfNavbarShowIndexArray < 5) {
              scrollNavbarLeft = 0;
            } else if (targetChannelIndexOfNavbarShowIndexArray === navbarShowIndexArrayLength - 1) {
              scrollNavbarLeft = this.rpx2px(110 * (navbarShowIndexArrayLength - 6));
            } else {
              scrollNavbarLeft = this.rpx2px(110 * (targetChannelIndexOfNavbarShowIndexArray - 4));
            }
            this.setData({
              scrollNavbarLeft: scrollNavbarLeft
            });
          }
          this.switchChannel(targetChannelIndex);
        }
      }
    },
    rpx2px: function (rpx) {
      return this.data.windowWidth * rpx / 750;
    },
    showChannelSettingModal: function () {
      this.setData({
        channelSettingShow: 'channel-setting-show',
        articlesHide: true,
        channelSettingModalHide: false
      });
      setTimeout(() => {
        this.setData({
          channelSettingModalShow: 'channel-setting-modal-show'
        });
      }, 50);
    },
    hideChannelSettingModal: function () {
      this.resetNavbar();

      this.setData({
        channelSettingShow: '',
        channelSettingModalShow: ''
      });
      setTimeout(() => {
        this.setData({
          channelSettingModalHide: true,
          articlesHide: false
        });
        this.getArticles(0);
      }, 500);
    },
    hideChannel: function (e) {
      let navbarShowIndexArray = this.data.navbarShowIndexArray;
      let navbarHideIndexArray = this.data.navbarHideIndexArray;
      navbarHideIndexArray.push(navbarShowIndexArray.splice(navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
      this.setData({
        navbarShowIndexArray: navbarShowIndexArray,
        navbarHideIndexArray: navbarHideIndexArray
      });
      this.storeNavbarShowIndexArray();
    },
    upChannel: function (e) {
      let navbarShowIndexArray = this.data.navbarShowIndexArray;
      let index = navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id));
      let temp = navbarShowIndexArray[index];
      navbarShowIndexArray[index] = navbarShowIndexArray[index - 1];
      navbarShowIndexArray[index - 1] = temp;
      this.setData({
        navbarShowIndexArray: navbarShowIndexArray
      });
      this.storeNavbarShowIndexArray();
    },
    showChannel: function (e) {
      let navbarShowIndexArray = this.data.navbarShowIndexArray;
      let navbarHideIndexArray = this.data.navbarHideIndexArray;
      navbarShowIndexArray.push(navbarHideIndexArray.splice(navbarHideIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
      this.setData({
        navbarShowIndexArray: navbarShowIndexArray,
        navbarHideIndexArray: navbarHideIndexArray
      });
      this.storeNavbarShowIndexArray();
    },
    storeNavbarShowIndexArray: function () {
      wx.setStorage({
        key: 'navbarShowIndexArray',
        data: this.data.navbarShowIndexArray
      });
    },
    resetNavbar: function () {
      let navbarArray = this.data.navbarArray;   
      this.setData({
        currentChannelIndex:0,
        navbarArray: navbarArray,
        scrollNavbarLeft: 0
      });
    }
  },
  attached: function () {
    let that = this;

    let navbarShowIndexArrayData = wx.getStorageSync('navbarShowIndexArray');
    if (navbarShowIndexArrayData) {
      this.setData({
        navbarShowIndexArray: navbarShowIndexArrayData
      });
    } else {
      this.storeNavbarShowIndexArray();
    }

    this.getArticles(0);

    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowWidth: res.windowWidth
        });
      }
    });

    let navbarArray = this.data.navbarArray;
    let navbarShowIndexArray = this.data.navbarShowIndexArray;
    let navbarHideIndexArray = [];
    navbarArray.forEach((item, index, array) => {
      if (-1 === navbarShowIndexArray.indexOf(index)) {
        navbarHideIndexArray.push(index);
      }
    });
    this.setData({
      navbarHideIndexArray: navbarHideIndexArray
    });
  },


})
