const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');

const handleMouse = (data) => {
    const { clientX, clientY, screen, video } = data;
    let x = clientX * screen.width / video.width;
    let y = clientY * screen.height / video.height;
    robot.moveMouse(x, y);
    robot.mouseClick();
}

const handleKey = (data) => {
    const { keyCode, meta, alt, ctrl, shift } = data;
    const temArr = [];
    if (meta) temArr.push(meta);
    if (shift) temArr.push(shift);
    if (alt) temArr.push(alt);
    if (ctrl) temArr.push(ctrl);
    const key = vkey[keyCode].toLowerCase();
    if (key[0] === '<') return;
    robot.keyTap(key, temArr);
}

module.exports = () => {
    ipcMain.on('robot', (e, type, data) => {
        if (type === 'mouse') {
            handleMouse(data);
        } else if(type==='key'){
            handleKey(data);
        }
    })
}