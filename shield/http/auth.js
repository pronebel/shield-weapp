import store from '../adapters/store'



const STORE_KEYS = {

  Token: 'AGENT_TOKEN'

}


export let getToken = function () {
  return store.get(STORE_KEYS.Token)
}


export let setToken = function (token) {
  store.set(STORE_KEYS.Token, token)
}


export let clear = function () {
  for (let key in STORE_KEYS) {
    store.remove(STORE_KEYS[key])
  }
}
export let toWxAuth = function () {

}