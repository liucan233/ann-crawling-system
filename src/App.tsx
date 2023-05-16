import { ConfigProvider, DatePicker } from 'antd';
// import css  from './App.module.css';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
// import { useState } from 'react';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ width: 400, margin: '100px auto' }}>
        <DatePicker/>
      </div>
    </ConfigProvider>
  );
}

export default App;
