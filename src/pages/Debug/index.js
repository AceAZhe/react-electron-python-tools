
import './index.scss';
import { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Divider, List } from 'antd';
import Tool from '@/common/utils/tool.js';
import {
    LoadingOutlined
} from '@ant-design/icons';
  
const getPort = require("get-port");
const path = require("path");
const spawn = require("child_process").spawn;
const fetch = require("node-fetch");
const desktopList = ['.lnk', '.pif', '.url']; 

const RightContent = () => {
    const bottomLine = useRef(null);
    const [appPath, setAppPath] = useState('');
    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropLoading, setDropLoading] = useState(false);

    useEffect(()=>{
        list.length && setLoading(false);
    },[list])
    
    const startUp = async () => {
        setLoading(true);
        clear();
        if (!appPath) return;
        const nodePort = await getPort();
        const winPort = await getPort();
        const filePath = appPath;
        const sp = spawn(
            filePath,
            [`--inspect=${nodePort}`, `--remote-debugging-port=${winPort}`],
            {
                cwd: path.dirname(filePath)
            }
        )
        sp.stdout && sp.stdout.on("data", handleSpawn);
        sp.stderr && sp.stderr.on("data", handleSpawn);
        const ports = [nodePort, winPort];
        const payloads = await Promise.all(
            ports.map(port => {
                return fetch(`http://127.0.0.1:${port}/json`).then(res => res.json())
            })
        )
        const pages = payloads.flat();
        setList([...pages]);   
    };

    const handleSpawn=(chunk)=>{
        const str = chunk.toString();
        const newStr = str.replace(/\[32m/g, "").replace(/\[32m/g, "").replace(/\[39m/g, "");
        setContent(res => res + newStr);
    }
    const openUrl=(item)=>{  //默认浏览器打开，或者应用内置窗口打开
        const url = item.devtoolsFrontendUrl.replace(/^\/devtools/, "devtools://devtools/bundled").replace(/^chrome-devtools:\/\//, "devtools://");
        window.open(url);  //f12控制台调试路径
    }
    const drop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const items = e.dataTransfer.items;
        if (!items.length) return;
        if (items[0].kind === 'file' && items[0].webkitGetAsEntry().isFile) { 
            const fileUrl = items[0].getAsFile().path;
            handleFileUrl(fileUrl);
        }
    }
    const handleFileUrl = (fileUrl) => {
        if (!fileUrl) return;
        const isDesktop = desktopList.some(item => fileUrl.indexOf(item) > -1);
        if (isDesktop) {
            setDropLoading(true);
            Tool.sendToPython('realPath.exe', [fileUrl], (res) => {           
                setAppPath(res);
                setDropLoading(false);
            });    
        } else {
            setAppPath(fileUrl);
        }
    }

    const scrollToBottom = () => {
        if (bottomLine && bottomLine.current) {
            bottomLine.current.scrollIntoView(false);
        }
    }
    const clear = () => {
        setList([]); 
        setContent('');
    }
    useEffect(() => {
        scrollToBottom();
    }, [content]);

    return (
        <div className='right-content content-main' style={{paddingTop:'20px'}}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
            >
                <Row>
                    <Col span={16}>
                        <Form.Item label="应用地址" rules={[{ required: true, message: '请输入应用地址!' }]} style={{ position: 'relative', top: '25px' }}>
                            <Row gutter={8}>
                                <Col span={21}>
                                    <Input placeholder="请输入应用地址!" value={appPath} onInput={
                                        (e) => {
                                            setAppPath(e.target.value)
                                        }
                                    } />
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={startUp} loading={loading}>
                                        启动
                                    </Button>                              
                                </Col>
                            </Row>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <div className='drop-area' onDrop={drop} onDragOver={e=>e.preventDefault()}>
                            {dropLoading?`获取真实路径中...` :'拖拽App'}
                        </div>
                    </Col>
                </Row>
            </Form>
            <Divider plain style={{margin:'8px 0 4px 0'}}>内容</Divider>
            <div className='flex a-start j-start flex-row right-content-list'>
                <div className='right-content-list-left flex-shrink h100'>
                    <List
                        dataSource={list}
                        renderItem={item => {                        
                            return (       
                                <List.Item key={item.id}>
                                    <Button type="text" size='small' className='nowrap' style={{width:'100px'}}>{item.title || item.type}</Button>
                                    <Button type="link" onClick={()=>openUrl(item)} size='small'>
                                        打开
                                    </Button>
                                </List.Item>
                            )
                        }}
                    />
                    <div className='flex a-center j-center'>
                        <Button onClick={clear}>
                             清空
                        </Button>
                    </div>
                </div>
                <div className='right-content-list-right flex-1 h100'>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    <div style={{height:'1px',width:'100%'}} ref={bottomLine}></div>
                </div>
            </div>
        </div>
    )
}

export default RightContent;