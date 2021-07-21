import { Image } from 'antd';
import { logo } from '@/common/config/data.js';
import './index.css';

const Logo = () => {
    return (
        <div className="logo-wrap flex a-center j-center w100">
          <Image
            width={80}
            height={80}
          preview={false}
          style={{borderRadius:'2px'}}
            src={logo}
          />
        </div>
    )
}

export default Logo;