let queryString = function (queryObj = {}) {
    let propStr = []
    for (let prop in queryObj) {
        propStr.push(prop + '=' + queryObj[prop])
    }
    let str = propStr.join('&')
    return str ? '?' + str : ''
}
export default class Router {
    constructor() {
        this._query = {}
        this._app = getApp()
        this._pages = getCurrentPages()
        if (this._pages.length > 0) {
            this.$page = this._pages[this._pages.length - 1]
        } else {
            this.$page = {}
        }

        this.$route = {
            query: Object.assign({}, this.$page.options),
            path: this.$page.route
        }
        console.log('page......', this.$page)

    }

    push(options = {}) {

        if (typeof options == "string") {
            options = {
                path: options,
                query: {}
            }
        }

        console.log(options)
        let {path, query} = options

        let url = path + queryString(query)
        console.log(url)
        wx.navigateTo({
            url
        })
    }

    replace(options = {}) {
        if (typeof options == "string") {
            options = {
                path: options,
                query: {}
            }
        }
        let {path, query} = options
        let url = path + queryString(query)
        wx.redirectTo({
            url
        })
    }

    back(pageNum = 1) {
        wx.navigateBack({
            delta: pageNum
        })
    }

    switchTab() {

    }

    reLanunch() {

    }

    update(query = {}) {
        this.$route.query = Object.assign({}, this.$route.query, query)
    }

}
