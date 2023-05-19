import { FC } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Upload, Input, List, UploadProps, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import css from "./index.module.css";
import { TDataset } from "../../types";

type TProps = {
  onChange: (datasetArr: TDataset[]) => any;
  datasetArr: TDataset[];
};

const getEarliestTime = (dataset: TDataset) => {
  if (!dataset.postArr[0]?.publishTime) {
    return null;
  }
  let result = dataset.postArr[0].publishTime;
  for (let i = 1; i < dataset.postArr.length; i++) {
    const time = dataset.postArr[i].publishTime;
    if (time && time < result) {
      result = time;
    }
  }
  return result;
};

export const DatasetManager: FC<TProps> = ({ onChange, datasetArr }) => {
  let lastUploadArr:typeof datasetArr=datasetArr
  const handleUpload: UploadProps["customRequest"] = ({ file }) => {
    if(!(file instanceof File)){
      message.error("发生未知错误");
      return;
    }
    if (file.size !== undefined && file.size > 10 * 1024 * 1024) {
      message.error("文件过大");
    } else if (file.type !== "application/json") {
      message.error(file.name+"不为json文件");
    } else {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const data = JSON.parse(reader.result) as TDataset;
          if (
            !Array.isArray(data.postArr) ||
            typeof data.siteName !== "string" ||
            typeof data.expertTime !== "string" ||
            typeof data.siteUrl !== "string"
          ) {
            message.error("数据基础信息格式不正确");
            return;
          }
          for (let i = 0; i < data.postArr.length; i++) {
            const { title, publishTime, content, href } = data.postArr[i];
            if (
              !href?.startsWith("http") ||
              !title ||
              !publishTime ||
              !content
            ) {
              message.error("postArr元素格式不正确");
              console.error("元素格式错误", "index", i, data.postArr[i]);
              return;
            }
          }
          const set = new Set();
          for (const d of lastUploadArr) {
            for (const { title, content } of d.postArr) {
              set.add(`${content?.length || ""}${title}`);
            }
          }
          const originNum = data.postArr.length;
          data.postArr = data.postArr.filter((p, i) => {
            const key = `${p.content?.length || ""}${p.title}`;
            const added = set.has(key);
            if (added) {
              console.warn("重复公告", i, p);
            } else {
              set.add(key);
            }
            return !added;
          });
          if (data.postArr.length < 1) {
            message.error("添加的数据集为空或已经存在",3000);
            return;
          }
          message.success(
            `从${file.name}的${originNum}条数据中导入了${data.postArr.length}条`
          );
          lastUploadArr=[data, ...lastUploadArr]
          onChange(lastUploadArr);
        }
      };
    }
  };
  const handleDelete = (index: number) => {
    console.log(index);
    const datasetArrCopy = [...datasetArr];
    datasetArrCopy.splice(index, 1);
    onChange(datasetArrCopy);
  };
  const handleFetch = () => {
    message.info("功能未实现");
  };
  return (
    <>
      <h3 className={css.title}>从本地导入</h3>
      <Upload.Dragger
        multiple
        accept="application/json"
        customRequest={handleUpload}
        showUploadList={false}
        fileList={[]}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击选择文件或者拖拽数据集文件到此处</p>
      </Upload.Dragger>

      <h3 className={css.title}>从URL导入</h3>
      <Input.TextArea rows={4} placeholder="每个url以英文逗号隔开" />
      <Button type="primary" className={css.importBtn} onClick={handleFetch}>
        导入
      </Button>

      <h3 className={css.title}>已经导入{datasetArr.length}数据</h3>
      <List bordered className={css.datasetList}>
        {datasetArr.map((d, i) => {
          const beginTime = getEarliestTime(d);
          return (
            <List.Item key={d.siteUrl}>
              <List.Item.Meta
                avatar={null}
                title={`${d.postArr.length}条${d.siteName}数据`}
                description={
                  <>
                    <span className={css.datasetDate}>
                      {new Date(d.expertTime).toLocaleDateString()}抓取
                    </span>
                    <span className={css.datasetSite}>
                      <a
                        href={d.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        查看网站
                      </a>
                    </span>
                    {beginTime && (
                      <span
                        className={css.datasetTimeSpan}
                      >{`${beginTime}开始`}</span>
                    )}
                  </>
                }
              />
              <DeleteOutlined
                color="red"
                className={css.deleteBtn}
                width={50}
                height={50}
                onClick={handleDelete.bind(null, i)}
              />
            </List.Item>
          );
        })}
      </List>
    </>
  );
};
