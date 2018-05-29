export default {
  pagerReset() {
    this.setData({
      totalCount: 0,
      currentPage: 0,
      pageLoadAll: false,
      loadMore: false,
    })
  },
  pageNext() {
    let currentPage = this.data.currentPage;
    this.setData({
      currentPage: currentPage + 1
    })
  },
  pageStat(curLength, pageCount) {
    let totalCount = this.data.totalCount
    totalCount += curLength;
    if (totalCount >= pageCount) {
      this.setData({
        pageLoadAll: true
      })
    }
    this.setData({
      loadMore: false,
      totalCount
    })
  },
}
/**
 totalCount: 0,
 currentPage:0,
 pageLoadAll:false,
 loadMore:false,


 **/