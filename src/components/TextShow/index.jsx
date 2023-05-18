import React from 'react'
import './index.css'
export default function TextShow({textShow}) {
  console.log(textShow);
  return (
    <div className='txtShow'>
      <p>
         {
          textShow
          ? textShow.content
          : '未选择'
         }  
      </p>
    </div>
  )
}
