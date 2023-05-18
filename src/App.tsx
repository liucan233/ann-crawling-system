import { ConfigProvider, Modal,Card } from "antd";
import css from "./App.module.css";
import zhCN from "antd/locale/zh_CN";
import "antd/dist/reset.css";
import { DatasetManager } from "./components/DatasetManager";
import { useState } from "react";
import { TDataset } from "./types";
// import { LeftFavorites } from "./components/LeftFavorites";
import { CenterPostFilter } from "./components/CenterPostFilter";
import { RightPostView } from "./components/RightPostView";

function App() {
  const [datasetArr, setDatasetArr] = useState<Array<TDataset>>([]);
  const [showManager, setShowManager] = useState(false);
  const [viewingPost,setViewing]=useState<TDataset['postArr'][0]|null>(null)

  const postArr=datasetArr.reduce<TDataset['postArr']>((acc,cur)=>acc.concat(cur.postArr),[])
  return (
    <ConfigProvider locale={zhCN}>
      <div className={css.wrap}>
        {/* <Card title='收藏的公告' className={css.leftWrap}>
          <LeftFavorites />
        </Card> */}
        <Card className={css.centerWrap}>
          <CenterPostFilter postArr={postArr} onManageDataset={setShowManager.bind(null,true)} onView={setViewing}/>
        </Card>
        <Card title='公告详情' className={css.rightWrap}>
          <RightPostView post={viewingPost}/>
        </Card>
      </div>
      <Modal title="数据集管理" open={showManager} footer={null} onCancel={setShowManager.bind(null,false)}>
        <DatasetManager onChange={setDatasetArr} datasetArr={datasetArr} />
      </Modal>
    </ConfigProvider>
  );
}

export default App;
