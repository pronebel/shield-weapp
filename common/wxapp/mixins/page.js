import Router from '../component/router'
import is from '../libs/is.js'
import store from '../adapters/store.js'
import {toast,loading,dialog } from '../adapters/nativeUI.js'
import fecha from '../../../npmjs/fecha.js'
import {navbar} from './global.js'
import { URL} from '../http/config.js'




function getID() {
  return Math.random().toString(36).substring(2, 15)
}

export let PageBase =function ($this) {


  var appInstance = getApp()
  $this.$global = appInstance.globalData
  $this.store = store
  $this.$navbar = navbar;
  $this.$router = new Router()
  $this.$route = $this.$router.$route
  
  $this.dialog = dialog;
  $this.toast = toast;
  $this.loading = loading;
  $this.$is = is
  $this.$fecha = fecha
  $this.$URL = URL;
  $this.setData({
    assetsUrl: 'https://hamstatic.life.cntaiping.com/star/'
  })
 
  console.log($this)
}

let emptyFunction = function () { }


/**
 * 
 * Page({
 * 
 * data:{
 * 
 * },
 * computed:{
 *  
 * 
 * },
 * methods:{
 * 
 * }
 * 
 * 
 * 
 * 
 * })
 * 
 * 
 * 
 * 
 * 
 */
export class PageBaseClass {

  constructor($pageContext) {
    PageBase($pageContext)
    this.$computed = $pageContext.computed; 
    this.$context = $pageContext;
    this.__data = $pageContext.data || {}


    $pageContext.$$ = this;
    //this.updateComputed()


  }

  __setData(obj = {}) {
    this.__data = Object.assign({}, this.__data, obj)
   
    this.$context.setData(this.__data);
  }

  set data(value) {
    this.__setData(value || {})
  }

	/**
	 * 获取 props，data，computed 的数据  （统一数据入口）
	 * @returns {*}
	 */
  get data() {
    return Object.assign({}, this.__data)
  }



  logger(str) {

    //console.log(this.name, str)
  }

  updateComputed() {
    // let computeFucs = this.$computed
    // let stickData = {}
    // for (let prop in computeFucs) {
    //   let func = computeFucs[prop]
    //   let result = func.apply(this)
    //   stickData[prop] = result
    // }
    // this.config['$computed'] = stickData
  }

}





