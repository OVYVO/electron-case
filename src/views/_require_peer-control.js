const EventEmitter = require('events')
const peer = new EventEmitter()
const { desktopCapturer } = require('electron')
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ type: ['screen'] })
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sources[0].id,
        width: window.screen.width,
        height: window.screen.height
      }
    }
  }, (stream) => {
    peer.emit('add-stream', stream)
  }, (err) => {
    console.log(err)
  })
}
getScreenStream()
module.exports = peer