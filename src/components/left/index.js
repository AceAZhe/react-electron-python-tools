import { Menu } from 'antd';
import { menuList } from '@/common/config/data.js';
import { Link } from 'react-router-dom';

const Left = () => {
  return (
    <Menu theme="dark" defaultSelectedKeys={['debug']} mode="inline" className='not-select'>
      {
        menuList.map(item => {
          return (
            <Menu.Item key={item.prop} icon={item.icon}>
              <Link to={item.path}>
                {item.name}
              </Link>
            </Menu.Item>
          )
        })
      }
    </Menu>
  )
}

export default Left;