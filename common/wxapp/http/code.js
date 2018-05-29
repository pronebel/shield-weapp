let ENUM_CODE = {
  SUCCESS: '_SUCCESS',
  NO_LOGIN: 2131
}

let codeIs = function (code, enumCode) {
  code = code ? code.toString() : ''
  return code === enumCode
}

export let codeCheck = {
  isSuccess: function (code) {
    return codeIs(code, ENUM_CODE.SUCCESS)
  },
  isNoLogin: function (code) {
    return codeIs(code, ENUM_CODE.NO_LOGIN)
  }
}
