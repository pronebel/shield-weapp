import { regex, regexMsg } from '../../utils/libs/regex'
import { dialog,toast} from '../adapters/nativeUI'
import is from '../libs/is.js'

let form = {

	/**
	 * 验证的几种规则：
	 * 1 在page中定义函数，
	 * 2 使用给定的雁阵规则（正则或者验证函数）
	 * {
     *      name:"xxx",
     *      rule:"required|maxlength:1,2",
     *      msg：“xxxx”
     * }
	 */
  validate(val, key, showMsg = true, msgType=1) {
    let that = this
    let rules = this.data.rules || {}

    let _rule = rules[key]

    if (!_rule) {
      return true
    }

    let { name, rule, msg } = _rule

    let _validateRules = rule

    let _result = null
    let errMsg = null;

    if (_validateRules && _validateRules.length > 0) {


      for (let i = 0; i < _validateRules.length; i++) {
        let _validate = _validateRules[i];
        let typename = typeof _validate

        if (typename === 'function') {
          //调用page中的函数
          _result = _validate.apply(that, [val])

        } else if (_validate instanceof RegExp) {
          _result = _regex.test(val);
        } else if (typename === 'string') {

          if (_validate == "required") {
            _result = !!val;
            if (!_result) {
              errMsg = name + "不可以为空";
            }
          } else if (regex[_validate] && (regex[_validate] instanceof RegExp)) {
            _result = regex[_validate].test(val)
            if (!_result) {
              errMsg = regexMsg[_validate]
            }

          } else {
            _result = false
          }

        } else {
          _result = false
        }

        if (!_result) {
          break;
        }
      }



    } else {
      _result = true
    }

    if (_result) {
      this.setData({
        formError: null
      })
      return true
    } else {
      let msgStr = errMsg || msg;
      if (showMsg) {
        if (msgType == 1) {
          toast.close()
          dialog.alert(msgStr)
        } else {

          toast.show(msgStr, { icon: "none" })
        }
      } else {
        this.setData({
          formError: msgStr
        })
      }
      return false
    }

  }
}

export default {
  initForm(rules = {}) {
    this.registerRule(rules)
  },
  registerRule(rules = {}) {

    let data = this.data.formdata || {}

    this.setData({
      rules: rules
    })
  },
  pickerModel(e) {

    let dataset = e.currentTarget.dataset || {};
    var setTmp = {}
    setTmp[dataset.index] = e.detail.value;
    this.setData(setTmp)
    this.model(e);
  },
  pickerModelSingle(e) {

    let dataset = e.currentTarget.dataset || {};
    var setTmp = {}
    setTmp[dataset.index] = e.detail.value;
    this.setData(setTmp)
    return this.modelSingle(e);
  },
  model(e) {


    let key = e.currentTarget.id
    let val = e.detail.value

    let data = this.data.formdata || {}
    data[key] = val

    this.setData({
      formdata: data
    })
    
    form.validate.apply(this, [val, key, true, 2])
  },
  modelSingle(e) {


    let key = e.currentTarget.id
    let val = e.detail.value

    if(form.validate.apply(this, [val, key, true, 2])){
      let data = {}
      data[key] = val;
      return data;
    }else{
      return null;
    }
  },

  validateAll() {

    let data = this.data.formdata || {}
   

    let rules= this.data.rules || {};

    let isOk = true
    for (let key in rules) {

      let val = data[key]
      let _ok = form.validate.apply(this, [val, key, true, 1])
      if (!_ok) {
        isOk = false
        break
      }

    }
     if (is.empty(data)){
      return false;
    }else{
       return isOk
    }
   
  }
}
