import { useState } from 'react';
import { Layout } from 'antd';
import Logo from '@/components/logo/index.js';
import Left from '@/components/left/index.js';
import {BrowserRouter} from 'react-router-dom';
import Router from '@/router/index.js';

import './App.scss';

const { Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = val => {
    setCollapsed(val);
  };

  return (
    <Layout>
      <BrowserRouter>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={150}>
        <Logo/>
        <Left/>
      </Sider>
      <Layout>
        <Content className='content'>
          <Router></Router>
        </Content>
      </Layout>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
