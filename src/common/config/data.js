import {
    DropboxOutlined,
    LinkedinOutlined,
    SkypeOutlined
  } from '@ant-design/icons';
import WxScreenshot from '@/pages/Tools/comp/wxScreenshot.js';
import ColorPicker from '@/pages/Tools/comp/colorPicker.js';
import logoUrl from '../../assets/images/logo.png';

export const menuList = [
    // {
    //     icon: <SkypeOutlined />,
    //     name: '使用说明',
    //     path:'/doc',
    //     prop: 'doc'
    // },
    {
        icon: <DropboxOutlined />,
        name: '应用调试',
        path:'/debug',
        prop: 'debug'
    },{
        icon: <LinkedinOutlined />,
        name: '集成工具',
        path:'/tools',
        prop: 'tools'
    }
]

export const logo = logoUrl;

export const tabList=[
    {
        name:'截图工具',
        prop:'wxScreenshot',
        tem: <WxScreenshot type='image'/>
    }, {
        name:'录屏工具',
        prop:'screencap',
        tem: <WxScreenshot type='video'/>
    }, {
        name:'取色工具',
        prop:'colorPicker',
        tem: <ColorPicker />
    }
    // , {
    //     name:'远程控制',
    //     prop:'remoteControl',
    //     tem: <div></div>
    // }
];