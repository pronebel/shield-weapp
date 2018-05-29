export default {

	broadcast (dataset = {}, scope) {
		console.log(dataset)
		let startTime = Date.now()
		let moduleName = dataset.module
		let method = dataset.method

		function checkChildren (childrens) {
			for (let comp in childrens) {
				let mod = childrens[comp]
				if (comp === moduleName) {
					mod[method].apply(mod,[dataset])
				} else {
					if (mod.$components.length > 0) {
						checkChildren(mod.$childrens)
					}
				}
			}
		}

		if (moduleName && method) {
			let pageComponents = scope.components
			checkChildren(pageComponents)
		}

		console.log('event times:', Date.now() - startTime)
	}

}
