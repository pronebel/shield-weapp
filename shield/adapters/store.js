export default {

	set (key, data) {
		return wx.setStorageSync(key, data)
	},
	get (key) {
		try {
			return wx.getStorageSync(key)
		} catch (e) {
			return null
		}
	},
	remove (key) {
		try {
			wx.removeStorageSync(key)
		} catch (e) {
			// Do something when catch error
		}
	}

}
