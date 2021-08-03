const path = require("path");
const child_process = require("child_process");
const EventEmitter = require('events');
const peer = new EventEmitter();
const { desktopCapturer } = require('electron');

 
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sendToPython(exe,params=[],callback=null) {  // params是数组参数，如["参数1","参数2"]
        const url = path.join('src/python/exe', exe);
        child_process.execFile(url, [JSON.stringify(params)], { encoding: "utf8" }, (err, stdout) => {
            if (err) {
                console.log('err',err);
                return;
            };
            
            try {
                const result = JSON.parse(stdout);
                console.log('result',result);
                if (result.code === 0) {
                    callback && callback(result.data);
                }
            } catch (err) {
                console.log(err);
            }
        })
    },
    async remoteDesktopControl(selector) {
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sources[0].id,
                    maxWidth: window.screen.width,
                    maxHeight:window.screen.height
                }
            }
        }, stream => {
            peer.emit('add-stream', stream);     
            const video = document.querySelector(selector);
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            }
        }, err => {
            console.log(err);          
        })
    }
}