function getID () {
	return Math.random().toString(36).substring(2, 15)
}



let emptyFunction = function () {}

class MyPage {

	constructor (originalPage,options = {}, ...args) {
		this.config = this.config || {}
		this.config.$type = 'page'
		this.config.name = 'page' + getID()

		this.config.computed = options.computed || {}
		this.config.data = options.data || {}
		this.config.$childrens = {}
		this.config.components = options.components || null
		this.config.updateData = options.updateData || emptyFunction
		this.config.eventOn = options.eventOn || emptyFunction

		this.initLifeCircle()
		this.updateComputed()

		this.$components()

		originalPage(options, ...args)
    Page()
	}

	/**
	 * 注入页面的生命周期
	 */
	initLifeCircle () {
		const list = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onRouteEnd']
		const _self = this

		for (let fn of list) {
			let tempFn = this.config[fn]

			this.config[fn] = function (...args) {
				if (_self[fn]) args = _self[fn].apply(this, args) || args

				if (tempFn) tempFn.apply(this, args)
			}
		}
	}

	$components () {
		if (this.config.components) {
			let components = this.config.components()
			for (let i = 0; i < components.length; i++) {
				let comp = components[i]
				this.config.$childrens[comp.name] = comp
			}
		}
	}

	logger (str) {

		//console.log(this.name, str)
	}

	updateComputed () {
		let computeFucs = this.config.computed
		let stickData = {}
		for (let prop in computeFucs) {
			let func = computeFucs[prop]
			let result = func.apply(this)
			stickData[prop] = result
		}
		this.config['$computed'] = stickData
	}

}

module.exports = MyPage
