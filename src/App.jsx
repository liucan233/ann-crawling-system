import { ConfigProvider, DatePicker, Form, Input, List, Row, Select, Col } from 'antd';
// import css  from './App.module.css';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import CollectList from './components/CollectList';
import TextShow from './components/TextShow';
import SearchList from './components/SearchList';
import SearchInput from './components/SearchInput';
import Search from 'antd/es/transfer/search';
import { useState } from 'react';
function App() {
  let [searchParams,setSearchParms] = useState([]);
  let [filterParams,setFilterParms] = useState([]);
  let [colletions,setCollections] = useState([]);
  let [textShow,setTextShow] = useState();
  let handleClick = (text) => {
    console.log('text',text)
    setTextShow(text);
  }
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{height:'100vh', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <CollectList collections = {colletions}/>

        <div style={{ width: '50rem', height: '55rem',margin:'0 10px'}}>
          <SearchInput />
          <SearchList handleClick = {handleClick} />
        </div>

        <TextShow textShow = {textShow}/>
      </div>
    </ConfigProvider>
  );
}

export default App;
