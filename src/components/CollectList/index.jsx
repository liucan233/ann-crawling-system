import React from 'react'
import './index.css'
import { List } from 'antd'
export default function CollectList({collections}) {
  const data = [
    {
      title: 'Ant Design Title 1',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 2',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 3',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },
    {
      title: 'Ant Design Title 4',
      time: '2003-3-5'
    },]
  return (
    <div className='colList'>
        <List
            // bordered
            style={{ margin: '10px', height: '100%' }}
            dataSource={data}
            header= {<div style={{textAlign:'center'}}>收藏</div>}
            pagination={{
              position: 'bottom',
              align: 'center',
              pageSize: 15,
              hideOnSinglePage: true,
            }}
            renderItem={(item, index) => {
              return <List.Item>
                        <span>{item.title}</span>
                        <span>{item.time}</span>
                     </List.Item>
            }}>
          </List>
    </div>
  )
}
