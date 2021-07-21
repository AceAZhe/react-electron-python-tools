
import { Tabs } from 'antd';
import { tabList } from '@/common/config/data.js';
import './index.scss';

const { TabPane } = Tabs;

const Tools = () => {
    const tabChange = (key) => {
        // console.log(key);
    }
    return (
        <div className='tools h100 content-main'>
            <Tabs defaultActiveKey={tabList[0].prop} onChange={tabChange} className='not-select'>
                {
                    tabList.map(item=>{
                        return (
                            <TabPane tab={item.name} key={item.prop}>
                               {item.tem}
                            </TabPane>
                        )
                    })
                }             
            </Tabs>
        </div>
    )
}

export default Tools;