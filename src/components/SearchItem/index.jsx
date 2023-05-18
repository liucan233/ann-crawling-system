import React from 'react'
import { Col, Select, Input } from 'antd'
export default function SearchItem() {
    let handleChange = e => {
        console.log(e.target.value);
    }
    let handleSelect = value => {
      console.log(value);
  }
  return (
    <>
    <Col span={6} >
          <Input style={{ width: '100%' }} onChange={handleChange}/>
    </Col>
    <Col span={6}>
          <Select
            defaultValue="包含"
            style={{ width: '100%' }}
            onChange={handleSelect}
            options={[
              { value: true, label: '包含' },
              { value: false, label: '不包含' }
            ]}
          />
    </Col>
    </>
  )
}
