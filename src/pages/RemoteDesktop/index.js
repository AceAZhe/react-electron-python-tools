import './index.scss';
import { Radio, Typography, Input, Button, message, Divider } from 'antd';
import { useState, useEffect, useRef } from 'react';
import {
    CopyOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { clipboard,ipcRenderer } = require('electron');

const RemoteDesktop = () => {
    const [value, setValue] = useState('client');
    const [inputVal, setInputVal] = useState('');
    const [localCode, setLocalCode] = useState('');
    const [isControl, setIsControl] = useState(false);
    const videoDom = useRef(null);

    useEffect(() => {
        getLocalCode();
    }, []);

    const getLocalCode = async () => {
        const num = await ipcRenderer.invoke('get-local-code');
        setLocalCode(num);
    }

    const copyData = () => {
        clipboard.writeText(localCode);
        message.success('复制成功');
    }
    const launch = () => {
        if (!inputVal) {
            message.warning('请先输入远程控制码');
            return;
        }
        setIsControl(true);
        ipcRenderer.send('control-remote-desktop', inputVal);
        
    }
  


    useEffect(() => {
        if (videoDom) {
            // videoDom.current
        }    
    }, [videoDom]);

    return (
        <div className='remote-desktop content-main'>
            <Radio.Group value={value} buttonStyle="solid" onChange={(e) => { console.log(e); setValue(e.target.value) }}>
                <Radio.Button value="client">允许控制本机</Radio.Button>
                <Radio.Button value="server">控制远程设备</Radio.Button>
            </Radio.Group>
            <div className='box-wrap'>
                <Text type="secondary">{value === 'client' ? '本机识别码' : '远程识别码'}</Text>
                {
                    value === 'client' ?
                        <div>
                            <Text className='box-num'>{localCode}</Text>
                            <CopyOutlined className='box-icon' onClick={copyData}/>
                        </div>
                        :
                        <div>
                            <Input placeholder="请输入远程设备识别码" className='input' value={inputVal} onChange={(e)=>{setInputVal(e.target.value)}}/>    
                        </div>
                }

            </div>
            {
                value === 'server' ?
                    <Button type="primary" className='btn' onClick={launch}>{isControl ? `正在控制 ${inputVal}` : '发起控制'}</Button>
                    : null
            }
            <Divider plain style={{margin:'8px 0 4px 0'}}>{isControl ? `正在控制 ${inputVal}` : ''}</Divider>
            {
                value === 'server' ?  <video ref={videoDom} className='screen-video'></video>: null
            }
        </div>
    )
}

export default RemoteDesktop;