import Router from './router'

function getID() {
  return Math.random().toString(36).substring(2, 15)
}

let emptyFunction = function () { }
/**
 *
 * 适配Vue编码风格的基于小程序的组件封装
 * 方便服用Vue代码
 * __ 内部私有变量（不直接使用，只接受 $ 变量的设置） ;
 * $ 内部变量 允许 this调用 (取值，设值) ;
 *
 * todo:  watch的机制
 *
 *
 */

const PAGE_LIFES = ['mounted'];

export default class Component {

  constructor(name, options = {}, $parent) {

    this.$options = options;

    this.$name = name || 'comp' + getID()
    this.$type = options.type || 'component'
    this.$parent = $parent
    this.$router = new Router()
    this.$route = this.$router.$route

    this.injectData();

    this.$childrens = {}
    this.$components = []
    this.components = this.$options.components || null

    this.injectProps();
    this.injectComputed();
    this.injectWatch();
    this.injectMethods();
    this.injectLifeCycle();

    this.injectMethods()
    this.updateComputed()

    this.mounted()

    if (this.components) {
      this.injectChildrens(this.components())
    }
  }
  /*********************************************************8 */
  injectMethods() {
    let methods = this.methods
    for (let prop in methods) {
      this[prop] = methods[prop]
    }
  }
  /******************************************************************88 */
  injectData(){
    let that = this;
    this.__data = {}
    this.__data_old = {}

    let dataset = this.$options.data || emptyFunction
    this.__data = dataset()
    // for(let key in this.__data){
    //   this[key]= {   
    //     name:key,   
    //     get:function(){
    //       return that.__data[key]
    //     },
    //     set:function(value){
    //       let obj = {}
    //       obj[key]=value;
    //       that.__setData(obj)
    //     }
    //   }
    // }
    this.__setData();
  }
  __setData(obj = {}) {
    this.__data = Object.assign({}, this.__data, obj)
    if (this['updateTimeout']) {
      clearTimeout(this['updateTimeout'])
    }
    this['updateTimeout'] = setTimeout(() => {
      this.updateComputed()
      this.execWatch()
      this.$emit()
    }, 200)
  }

  set data(value) {
    this.__setData(value || {})
  }

	/**
	 * 获取 props，data，computed 的数据  （统一数据入口）
	 * @returns {*}
	 */
  get data() {
    return Object.assign({}, this.__props, this.__computed, this.__data)
  }

  toData() {
    let data = Object.assign({
      __id: this.$name
    }, this.__props, this.__computed, this.__data)
    return data
  }
  /***************************************************************88 */
  injectWatch(){
    this.watch = this.$options.watch
  }
  injectMethods(){
    this.methods = this.$options.methods || {}
  }
  /**********************************************************************8 */
  injectProps() {
    this.__props = {}
    this.__props_old = {}
    this.$props = this.$options.props
  }
  get $props() {
    return this.__props
  }
  set $props(value) {
    let props = value || {}
    this.__props = Object.assign({}, props)
  }

  /************************************************************************* */
  injectComputed() {
    this.computed = this.$options.computed || {}
    this.__computed = {}
  }
  updateComputed() {
    let computeFucs = this.computed
    let stickData = {}
    for (let prop in computeFucs) {
      let func = computeFucs[prop]
      let result = func.apply(this)
      stickData[prop] = result
    }
    this.__computed = stickData
    return this.__computed
  }

  get $computed() {
    return this.updateComputed()
  }
  /**************************************************************************** */
  injectLifeCycle() {
    let lifes = PAGE_LIFES;
    lifes.forEach(life => {
      this[life] = this.$options[life] || emptyFunction
    })
  }

  updateQuery(value) {
    let query = value || {}
    this.$router.update(query)
    this.updateComputed()
  }

  logger(str) {

    //console.log(this.name, str)
  }

  $pageDataUpdate() {
    this.logger('pageDataUpdate')
    let updateData = {}
    updateData[this.$name] = this.toData()

    function takeData(target) {
      let childCount = target.$components.length
      let components = target.$childrens
      if (childCount > 0) {
        for (let comp in components) {
          let compTarget = components[comp]
          updateData[comp] = compTarget.toData()
          takeData(compTarget)
        }
      }
    }

    takeData(this)
    console.log('parent Data Start===================')
    console.log(updateData)
    this.$parent && this.$parent.setData(updateData)
    console.log('parent Data End===================')
  }

  setParent($parent) {
    this.$parent = $parent
  }

  componentDataUpdate(moduleName, data) {
    this.logger('componentDataUpdate...' + Date.now())
    let _update = {}
    _update[moduleName] = data
    this.__setData(_update)

  }

  $emit() {
    this.logger('updating...' + Date.now())
    if (this.$parent) {
      if (this.$parent.$type === 'page') {
        this.$pageDataUpdate()
      } else {
        this.$parent.componentDataUpdate(this.$name, this.toData())
      }

    }
  }

  reMountChild(moduleName) {
    let component = this.$childrens[moduleName]
    if (component) {
      component.mounted()
    }
  }

  injectChildrens(components = []) {
    this.$components = components
    for (let i = 0; i < components.length; i++) {
      let comp = components[i]
      this.$childrens[comp.$name] = comp
      //comp.mounted();
    }
  }

 

  execWatch() {

  }



  mounted() {

  }

}
