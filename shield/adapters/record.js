


const recorderManager = wx.getRecorderManager();


const CONST_RECORD_TIMES = 60;
const recoptions = {
  duration: CONST_RECORD_TIMES * 1000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 24000,
  format: 'mp3',
  frameSize: 50
}


export default {
  start(){
    recorderManager.start(recoptions);
  },
  onStop(context){
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res

      context.setData({
        tempFilepath: tempFilePath
      })
    })
  }
}
