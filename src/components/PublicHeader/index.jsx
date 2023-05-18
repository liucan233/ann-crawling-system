import { Button } from 'antd'
import React from 'react'
import './index.css'
export default function PublicHeader() {
  return (
    <div className='listHeader'>
       数据总条数
       <Button style={{float:'right'}}>数据管理</Button>
    </div>
  )
}
