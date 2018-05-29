// pages/shopcart/index.js
Page({

  data: {
    shopCart: [
      {
        goodsId: 0 || '',  //商品的id也可是其他的唯一标识符
        isChecked: false,  //是否被选中
        imageUrl: '',  //商品的缩略图
        title: '',  //商品的标题
        price: 0,  //商品的价格
        count: 1,  //商品的数量
      }
    ],
    event: {  //值为callback的名称
      checkBoxChange: 'checkBoxChange',
      deleteShopCartItem: 'deleteShopCartItem',
      changeCount: 'changeCount',
      inputChange: 'inputChange'
    }
  },
  checkBoxChange: function (e) {
    //通过 e.detail.value获取一个数组
    //此数组包含被选中的checkbox的value值
    //value的值为当前checkbox的索引值
  },
  deleteShopCartItem: function (e) {
    //通过 e.currentTarget.dataset.index 获取当前的索引值
    //根据索引值删除相应的商品
  },
  changeCount: function (e) {
    //通过e.currentTarget.dataset.type 获取
    //的值为 + 或者 -  + 代表是增加数量，-代表数量减少
    //通过e.currentTarget.dataset.index 获取
    //当前的索引值
  }
})