import Router from './router'

function getID () {
	return Math.random().toString(36).substring(2, 15)
}

let emptyFunction = function () {}
/**
 *
 * 基于小程序的组件封装
 *
 * __ 内部私有变量（不直接使用，只接受 $ 变量的设置） ;
 * $ 内部变量 允许 this调用 (取值，设值) ;
 *
 * todo:  watch的机制
 *
 *
 */
export default class Component {

	constructor (name, options = {}, $parent) {

		this.name = name || 'comp' + getID()
		this.$type = options.type || 'component'
		this.$parent = $parent

		this.$router = new Router()
		this.$route = this.$router.$route

		this.__data = {}
		this.__data_old = {}

		this.dataset = options.dataset || emptyFunction
		this.$data = this.dataset()

		this.$childrens = {}
		this.$components = []
		this.components = options.components || null

		this.__props = {}
		this.__props_old = {}
		this.$props = options.props

		this.computed = options.computed || {}
		this.__computed = {}

		this.watch = options.watch

		this.methods = options.methods || {}


		this.mounted = options.mounted || emptyFunction



		this.execMethods()
		this.updateComputed()
		this.mounted()

		if (this.components) {
			let components = this.components()
			this.injectChildrens(components)
		}
	}

	updateQuery (value) {
		let query = value || {}
		this.$router.update(query)
		this.updateComputed()
	}

	logger (str) {

		//console.log(this.name, str)
	}

	$pageDataUpdate () {
		this.logger('pageDataUpdate')
		let updateData = {}
		updateData[this.name] = this.toData()

		function takeData (target) {
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

	setParent ($parent) {
		this.$parent = $parent
	}

	componentDataUpdate (moduleName, data) {
		this.logger('componentDataUpdate...' + Date.now())
		let _update = {}
		_update[moduleName] = data
		this.__setData(_update)

	}

	$emit () {
		this.logger('updating...' + Date.now())
		if (this.$parent) {
			if (this.$parent.$type === 'page') {
				this.$pageDataUpdate()
			} else {
				this.$parent.componentDataUpdate(this.name, this.toData())
			}

		}
	}

	reMountChild (moduleName) {
		let component = this.$childrens[moduleName]
		if (component) {
			component.mounted()
		}
	}

	injectChildrens (components = []) {
		this.$components = components
		for (let i = 0; i < components.length; i++) {
			let comp = components[i]
			this.$childrens[comp.name] = comp
			//comp.mounted();
		}
	}

	__setData (obj = {}) {
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

	set $data (value) {
		this.__setData(value || {})
	}

	/**
	 * 获取 props，data，computed 的数据  （统一数据入口）
	 * @returns {*}
	 */
	get $data () {
		return Object.assign({}, this.__props, this.__computed, this.__data)
	}

	toData () {
		let data = Object.assign({
			name: this.name
		}, this.__props, this.__computed, this.__data)
		return data
	}

	get $props () {
		return this.__props
	}

	set $props (value) {
		let props = value || {}
		this.__props = Object.assign({}, props)
	}

	execMethods () {
		let methods = this.methods
		for (let prop in methods) {
			this[prop] = methods[prop]
		}
	}

	execWatch () {

	}

	updateComputed () {
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

	get $computed () {
		return this.updateComputed()
	}

	mounted () {

	}

}
