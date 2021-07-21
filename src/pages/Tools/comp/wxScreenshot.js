import { Button, Image, Divider, Checkbox, Input, Tooltip, message } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import './index.scss';
import Tool from '@/common/utils/tool.js';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';

const child_process = require('child_process');
const path = window.require('path');
const { ipcRenderer, clipboard } = window.require('electron');
const exePath = path.join('src', 'pages/Tools/wx_screenshot/PrintScr.exe');
const { shell } = window.require('electron');

const WxScreenshot = (props) => {
    const { type } = props;
    const typeText = useMemo(() => {
        return type === 'image' ? '截图（CommandOrControl+X）' : '录屏（ESC终止）';
    }, [type])
    const [imgUrl, setImgSrc] = useState('');
    const [value, setValue] = useState(true);
    const [videoPath, setVideoPath] = useState('');
    const [videUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const tooltip = useMemo(() => {
        return type === 'image' ? '需要在当前页面才能使用快捷键' : 'ESC键终止录屏';
    }, [type])

    const onChange = e => {
        setValue(e.target.checked);
    };

    const wxScreenshot = (callback = null) => {
        if (value) {
            const isRely = ipcRenderer.sendSync('min-window', { type: 'screenshot' });
            if (isRely) {
                setTimeout(() => {
                    callback();
                }, 0)
            }
        } else {
            callback();
        }
    }
    const screencap = () => {
        Tool.sendToPython('screencap.exe', [videoPath], (res) => {
            setLoading(false);
            ipcRenderer.send('wx-screenshot');
        });
    }


    const wxScreenshotHandle = () => {
        const screen_window = child_process.execFile(exePath);
        screen_window.on('exit', (code) => {
            //执行成功返回 1，返回 0 没有截图
            setLoading(false);
            ipcRenderer.send('wx-screenshot');
            if (!code) return;
            const imgUrl = clipboard.readImage().toDataURL(); //返回base64格式的图片
            setImgSrc(imgUrl);
        })
    }
    const openFile = async () => {
        if (!videoPath) {
            message.warning('This is a warning message');
            return;
        };
        try {
            await  shell.openExternal(videoPath);
        } catch (err) {
            message.warning('默认浏览器不存在，请重试！');
        }
    }

    useEffect(() => {
        ipcRenderer.send('register-screenshot-key');
        type === 'image' && ipcRenderer.on('key-wx-screenshot', (e) => {
            setImgSrc('');
            wxScreenshot(() => {
                wxScreenshotHandle();
            })
        })
        return () => {
            ipcRenderer.send('unregister-screenshot-key');
        }
    }, []);

    return (
        <div className='wxScreenshot h100'>
            {type === 'video' ?
                <div className='flex a-center j-start flex-row' style={{ marginBottom: '10px' }}>
                    <div style={{ width: '115px' }}>视频存储位置：</div>
                    <Input placeholder="请输入应用地址!" value={videoPath}
                        style={{ width: '300px' }}
                        onInput={e => setVideoPath(e.target.value)} />
                    <Button type="primary" style={{ marginLeft: '10px' }} size='middle' onClick={openFile}>
                        打开
                    </Button>
                </div>
                : null
            }
            <div>
                <Checkbox onChange={onChange} checked={value} className='not-select'>{typeText}时隐藏当前窗口</Checkbox>
                <Tooltip title={tooltip}>
                    <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.2)', cursor: 'pointer' }} />
                </Tooltip>
            </div>
            <div style={{ marginTop: '20px' }}>
                <Button
                    loading={loading}
                    onClick={() => {
                        setLoading(true);
                        if (type === 'image') {
                            setImgSrc('');
                            wxScreenshot(() => {
                                wxScreenshotHandle();
                            })
                        } else if (type === 'video') {
                            wxScreenshot(() => {
                                screencap();
                            })
                        }
                    }}>{typeText}
                </Button>
                {
                    imgUrl && <Button
                        style={{ marginLeft: '20px' }}
                        onClick={() => {
                            ipcRenderer.send('save-file', imgUrl);
                        }}>
                        另存为
                 </Button>
                }
            </div>

            <Divider plain style={{ margin: '16px 0 0 0' }}>内容</Divider>
            <div className='img-wrap flex a-center j-center'>
                {
                    type === 'image' ?
                        <Image
                            style={{ minWidth: '100%', width: '100%' }}
                            src={imgUrl}
                        />
                        : <video >
                        </video>
                }
            </div>
        </div>
    )
}
export default WxScreenshot;