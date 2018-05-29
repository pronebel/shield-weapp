import { URL, METHOD, ContentType, GET_SYSTEM_INFO } from './config'
import is from '../libs/is.js'
import qs from '../../nbjs/libs/url/param'
import { loading as AjaxLoading, dialog } from '../adapters/nativeUI.js'

import * as auth from './auth'
import { codeCheck } from './code'



/**
 * http的封装
 * @param opts:{
 *
 *  cache:{       //cache不传则不开启
 *    exp:1,      //0 不开启
 *    read:-1,    //-1不开启
 *  }
 * }
 * @param parseFunc
 * @returns {*}
 */
export let createApi = (opts) => {

  var headerConfig = {}
  if (opts.isStream) {
    headerConfig['Content-Type'] = undefined // 'application/octet-stream';
  } else {
    headerConfig['Content-Type'.toLowerCase()] = ContentType.RESTFUL
  }

  if (opts.headers) {
    for (let key in opts.headers) {
      headerConfig[key] = opts.headers[key]
    }
  }
  console.log(opts.url)
  let options = {
    method: opts.method || 'GET',
    url: opts.url,
    params: opts.params || {},
    data: opts.data || {},
    headers: headerConfig,
    cache: false,
    timeout: 100000
    // withCredentials:true
  }

  let msgId = -1

  let loadingBar = opts.progress === undefined ? true : !!opts.progress
  let silent = opts.silent === undefined ? false : !!opts.silent

  if (loadingBar) {
    //AjaxLoading.show('加载中...')
  }

  var promise = new Promise(function (resolve, reject) {

    reject = reject || function (resp) { }
    let options2 = {
      url: options.url,
      method: options.method,
      data: options.data,
      header: headerConfig,
      success: function (response) {
        console.log(response)
        let resp = response.data
        if (loadingBar) {
          AjaxLoading.close()
        }
        if (codeCheck.isSuccess(resp.retCode)) {

          resolve(resp.retData)
        } else {

          let retCode = resp.retCode || ''
          retCode = retCode.toString()
          if (retCode.indexOf('TOKEN_') > -1) {
            auth.clear()
            console.warn(retCode)
            auth.toWxAuth()
          } else {
            // alert(JSON.stringify(resp));
            console.error(opts.url + ':' + resp.retMessage)

            if (!silent) {
              dialog.alert(resp.retMessage || resp.exception || "服务器错误")
            }

            reject({ response, msgId, biz: 1 })
          }
        }
      },
      fail: function (response) {
        console.log(response)
        let errMsg = response.errMsg
   



        if (loadingBar) {
          AjaxLoading.close()
        }

        if (silent) {
          reject({ response, msgId })
          return
        }
        if (errMsg){
          dialog.alert(errMsg)
        }
        reject({ response, msgId })

        // if (status === '504') {
          
        //   reject({ response, msgId })
        // } else if (status === '401') {
        //   auth.clear()
        //   console.warn('toauth')
        //   wx.navigateTo({
        //     url: '/pages/basic/401',
        //   })
        // } else if (status === '500') {
        //   dialog.alert('服务器报错,请联系系统管理员')
        //   reject({ response, msgId })
        // } else {
        //   // alert(JSON.stringify(response));
        //   reject({ response, msgId })
        // }
      }
    }

    console.log(options2)

    wx.request(options2)

  })

  return promise

}

/**
 * 获取缓存的KEY
 * @param url
 * @param data
 * @returns {*}
 */
let getCacheKey = (url, data) => {
  return url + JSON.stringify(data)
}



/**
 * 含有url参数的post方法
 * @param url
 * @param data
 * @param opts
 * @param urlParam
 * @returns {*}
 */
export let postWithUrlParam = (url, data = {}, opts = {}, urlParam) => {
  
  let cacheKey = getCacheKey(url, data)
  opts.params = Object.assign({}, urlParam)
  opts.url = URL.mixUrl(opts.apiUrl, url,opts.params)
  let systemData = GET_SYSTEM_INFO()
  opts.cacheKey = cacheKey
  opts.method = METHOD.POST
   if (is.array(data)) {
    opts.data = data
  } else {
    opts.data = Object.assign({}, data, systemData)
  }
  return createApi(opts)
}
/**
 * http的GET请求
 * @param url
 * @param data
 * @param opts
 * @returns {*}
 */
export const get = (url, data = {}, opts = {}) => {

  let params = Object.assign({}, data)
  let cacheKey = getCacheKey(url, data)
  opts.url = URL.mixUrl(opts.apiUrl, url, params  )
  opts.cacheKey = cacheKey
  opts.method = METHOD.GET
  return createApi(opts)
}

/**
 * http的POST请求
 * @param url
 * @param data
 * @param opts
 * @returns {*}
 */
export let post = (url, data = {}, opts = {}) => {

  let cacheKey = getCacheKey(url, data)
  opts.url = URL.mixUrl(opts.apiUrl, url, opts.params)


  opts.cacheKey = cacheKey
  opts.method = METHOD.POST
  let systemData = GET_SYSTEM_INFO()
  if (is.array(data)){
    opts.data = data
  }else{
    opts.data = Object.assign({}, data, systemData)
  }

  return createApi(opts)
}
