import { join as urlJoin } from '../../nbjs/libs/url/join'
import Params from '../../nbjs/libs/url/param'
import * as auth from './auth'
export const GET_SYSTEM_INFO = function () {
  return {

  }
}

let getCurrentPage = function () {
  let pages = getCurrentPages();
  let tmp = pages[pages.length - 1]
  return tmp.route
}
export let URL = {

  //API: "http://10.100.19.101:8099/api/",
  mixUrl: function (apiUrl,url,params={}){

    let restparam = {
      callerApp: "ICRMCLIENT",
      pageUrl: getCurrentPage(),
      userType: 'BANK_CUSTOMER'
    }

    params = Object.assign({}, restparam, params);
    if (!apiUrl) {
      apiUrl = URL.API
    }
    let token = auth.getToken();

    if (token) {
      params["token"] = token
    }


    return urlJoin(apiUrl, url) + Params.stringify(params, "?")
  },
   getApiUrl:function(apiUrl, url){
    if (!apiUrl) {
      apiUrl = URL.API
    }
    return urlJoin(apiUrl, url)
  }
}

/**
 * http method
 */
export let METHOD = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
}

/**
 * http-content-type
 * @type {{NORMAL: string, RESTFUL: string}}
 */
export let ContentType = {
  NORMAL: 'application/x-www-form-urlencoded',
  RESTFUL: 'application/json;charset=utf-8'

}
