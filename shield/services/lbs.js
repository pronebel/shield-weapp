
import QQMapWX from '../../../npmjs/qqmap-wx-jssdk.js'


export let qqmapsdk = new QQMapWX({
  key: 'PKQBZ-IKS6P-P7AD2-LIDAI-ANM3S-DNBMI'
});


var promise = new Promise(function (resolve, reject) {

});
export let search = function (keyword) {
  var promise = new Promise(function (resolve, reject) {
    qqmapsdk.search({
      keyword: keyword,
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        console.log(res);
      }
    })
  });

  return promise;
}


export let gps = function () {
  var promise = new Promise(function (resolve, reject) {
    wx.getLocation({
      type: 'gcj02',//'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        resolve(res)

      },
      fail: function (res) {
        reject(res)
      }
    });
  });


  return promise


}

export let location = function () {
  var promise = new Promise(function (resolve, reject) {
    let gpsPromise = gps(); 
    gpsPromise.then(function (data) {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: data.latitude,
          longitude: data.longitude
        },
        coord_type:5,
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) {
          console.log(res);
        }
      });
    })
  });

  return promise
}