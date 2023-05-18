import {ConfigProvider} from 'antd';
// import css  from './App.module.css';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import Manage from "./components/Manage";
import {useState} from "react";
import data from './test/jjc.cq.gov.cn.json'

const {log} = console;

interface DataType {
  "siteName": string,
  "siteUrl": string,
  "expertTime": string,
  "postArr": Array<ArticleDataType>
}

interface ArticleDataType {
  "title": string | null,
  "publishTime": string | null,
  "content": string | null,
  "href": string | null
}

// 模拟数据
const mockData: Array<DataType> = [111, 222, 333].map(website => (
  {
    "siteName": `${website}网站`,
    "siteUrl": `www.${website}.${website}`,
    "expertTime": new Date().toLocaleTimeString(),
    "postArr": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => {
      return {
        "title": `title${item}`,
        "publishTime": new Date().toLocaleDateString(),
        "content": `正文${item}`,
        "href": `文章链接http://${item}`
      }
    })
  }
))

// 仿造一些数据
const AllData = [1, 2, 3, 4, 5].map(() => ({...data}))

function App() {
  log(mockData);
  const [allData, setAllData] = useState<Array<DataType>>(AllData)
  const [files, setFiles] = useState<Array<File | null>>([])
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{width: '80%', margin: "auto"}}>
        <Manage datas={allData} setData={setAllData} files={files} setFiles={setFiles}/>
      </div>
    </ConfigProvider>
  );
}

export default App;
