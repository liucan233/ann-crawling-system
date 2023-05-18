import React, {Dispatch, SetStateAction, useState} from "react";
import {DeleteOutlined} from "@ant-design/icons"
import {ColumnsType} from "antd/es/table";
import {Button, Space, Statistic, Table} from "antd";
import {TablePaginationConfig} from "antd/lib";
import {FilterValue, SorterResult} from "antd/es/table/interface";
import UploadFile from "../UploadFile";
import './index.css'
import TextArea from "antd/es/input/TextArea";

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

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

type PropsType<T> = {
  datas: T;
  setData: (t: T) => void;
  files: Array<File | null>;
  setFiles: Dispatch<SetStateAction<(File | null)[]>>;
}


const Manage: React.FC<PropsType<Array<DataType>>> = ({
                                                        datas,
                                                        setData,
                                                        files,
                                                        setFiles
                                                      }: PropsType<Array<DataType>>) => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  datas = datas.map((data, index) => ({key: index, ...data}))
  log(datas.length)

  // 删除数据
  const deleteData = (record: DataType, index: number) => {
    datas.splice(index, 1);
    setData(datas);
  }

  // Table数据
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
    // extra: TableCurrentDataSource<DataType>
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  }

  const handleContent = (record: DataType, index: number) => {
    log(record, index)

  }


  // Table
  const columns: ColumnsType<DataType> = [
    {
      title: '网站名字',
      dataIndex: 'siteName',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '导入时间',
      dataIndex: 'expertTime',
      key: 'time',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '数据集数据条数',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (value, record: DataType, index) => (
        <Space size="middle" align={"center"}>
          {`${record.postArr.length}条`}
        </Space>
      ),
    },
    {
      title: '数据集抓取时间',
      dataIndex: 'captureTime',
      key: 'capture_time',
      ellipsis: true,
      align: 'center',
      render: (value, record: DataType, index) => (
        <Space size="middle" align={"center"}>
          {'value'}
        </Space>
      ),
    },
    {
      title: '网站链接',
      dataIndex: 'siteUrl',
      key: 'url',
      ellipsis: true,
      align: 'center',
      render: (text) => <a href={text} target="_blank">{text}</a>,
    },
    {
      title: '删除数据',
      key: 'delete',
      align: 'center',
      render: (_, record: DataType, index) => (
        <Space size="middle" align={"center"}>
          <span onClick={() => deleteData(record, index)} style={{cursor: "pointer"}}>
            <DeleteOutlined style={{fontSize: '20px'}}/>
          </span>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Statistic title="总数" value={datas.length} precision={0}/>
      <Table columns={columns} dataSource={datas}
             pagination={tableParams.pagination}
             onChange={handleTableChange}
      />
      <Space direction="vertical" style={{width: '50%', border: '1px #acacac'}}>
        <Space size={"small"}>导入新数据</Space>
        <Space>从本地导入
          <UploadFile files={files} setFiles={setFiles}/>
        </Space>
        {/*</Space>*/}

        <Space direction="vertical">
          <TextArea placeholder="请输入url列表，以英文逗号隔开，支持逗号后换行" rows={4} allowClear autoSize
                    style={{width: '500px'}}/>
          <Button type="primary" ghost style={{width: '500px'}}>导入</Button>
        </Space>
      </Space>
    </>
  )
}

export default Manage;