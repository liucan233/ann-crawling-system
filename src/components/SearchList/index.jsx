import React from 'react'
import { List } from 'antd'
import './index.css'
import PublicHeader from '../PublicHeader'
export default function SearchList({handleClick}) {
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
    <div className='searchList'>
        <List
            bordered
            style={{ margin: '10px', height: '100%' }}
            dataSource={data}
            header= {<PublicHeader />}
            pagination={{
              position: 'bottom',
              align: 'center',
              pageSize: 12,
              hideOnSinglePage: true,
            }}
            renderItem={(item, index) => {
              return <List.Item onClick={()=>handleClick(item)}>
                        <span>{item.title}</span>
                        <span>{item.time}</span>
                     </List.Item>
            }}>
          </List>
    </div>
  )
}
