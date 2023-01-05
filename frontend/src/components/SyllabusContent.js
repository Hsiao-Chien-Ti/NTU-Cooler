import React from "react";
import { Card, Table } from 'antd';
const SyllabusContent = ({ rawdata }) => {
    const column = [
        {
            title: 'Week',
            dataIndex: 'weekNum',
            key: 'weekNum',
        },
        {
            title: 'Outline',
            dataIndex: 'outline',
            key: 'outline',
        },
    ]
    let sorted=[...rawdata]
    sorted.sort(function(a,b){
        return a.weekNum>b.weekNum ? 1 : -1
    })
    const data=sorted.map((item,i)=>({key:i,weekNum:item.weekNum,outline:item.outline}))
    // console.log(data)
    return (
      <Table
        dataSource={data}
        columns={column}
        pagination={false}
        style={{ background: "#ffe38e", color: "#3e3b44" }}></Table>
    );
}
export default SyllabusContent