import { List, message } from "antd";
import { FC, MouseEventHandler, ReactNode } from "react";
import { TDataset } from "../../types";
import css from "./index.module.css";

export const PostList: FC<{
  postArr: Array<TDataset["postArr"][0] & { highlight?: ReactNode }>;
  onClickItem: (v:TDataset['postArr'][0])=>any
}> = ({ postArr,onClickItem }) => {
  const handleOpenSource:MouseEventHandler<HTMLSpanElement>=(e)=>{
    if(e.target instanceof HTMLSpanElement){
      const {index}=e.target.dataset
      if(typeof index==='string'){
        const targetSite=postArr[Number(index)].href
        if(targetSite){
          window.open(targetSite)
        } else {
          message.error('公告url无效')
        }
      }
    }
  }
  return (
    <div onClick={handleOpenSource}>
      <List className={css.list}>
      {postArr.map((p,i) => {
        return (
          <List.Item key={`${p.content?.length}${i}`} className={css.listItem} onClick={onClickItem.bind(null,p)}>
            <List.Item.Meta
              avatar={null}
              title={`${i+1}. ${p.title}`}
              description={
                <>
                  <div>
                    <span className={css.postInfo}>{p.publishTime}</span>
                    <span className={css.postInfo} data-index={i}>查看原文</span>
                  </div>
                  {p.highlight||p.content}
                </>
              }
            />
          </List.Item>
        );
      })}
    </List>
    </div>
  );
};
