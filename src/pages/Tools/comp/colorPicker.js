import { Button,  Divider } from 'antd';
import Tool from '@/common/utils/tool.js';
const { ipcRenderer } = window.require('electron');

const ColorPicker = () => {
    const startUp = () => {
        Tool.sendToPython('colorPicker.exe', [], (res) => {
           
        });
    }
    return (
        <div className='color-picker'>
            <Button type="primary" onClick={startUp}>
                启动
            </Button>
            <Divider plain style={{margin:'8px 0 4px 0'}} >内容</Divider>
        </div>
    )
}

export default ColorPicker;