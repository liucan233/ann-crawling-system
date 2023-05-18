import React, {Dispatch, SetStateAction} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {Button, message, Upload} from 'antd';

const {log} = console;

const props: UploadProps = {
  name: 'file',
  // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  // headers: {
  //   authorization: 'authorization-text',
  // },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

type PropsType = {
  files: Array<File | null>;
  setFiles: Dispatch<SetStateAction<(File | null)[]>>
}

const UploadFile: React.FC<PropsType> = ({files, setFiles}: PropsType) => {
  const beforeUpload = (file: any, fileList: any) => {
    log(file, fileList)
    return false;
  }
  return (
    <Upload {...props} beforeUpload={beforeUpload}>
      <Button icon={<UploadOutlined/>}>Click to Upload</Button>
    </Upload>
  )
};

export default UploadFile;