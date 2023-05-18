import React from 'react'
import {Row, Col, Button, } from 'antd'
import SearchItem from '../SearchItem'
import './index.css'
export default function SearchInput({ search }) {
  return (
    <div className='searchInput'>
        <Row gutter={[16,16]} align='center'>
          <SearchItem />
          <SearchItem />
          <SearchItem />
          <SearchItem />
          <Col span={8}>
             <Button
              block 
             >搜索</Button>
          </Col>
        </Row>
   
    
    </div>
  )
}
