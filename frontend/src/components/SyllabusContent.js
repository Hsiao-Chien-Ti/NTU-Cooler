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
    // console.log(rawdata)
    const data=rawdata.map((item,i)=>({key:i,weekNum:item.weekNum,outline:item.outline}))
    // console.log(data)
    return (
        <Table dataSource={data} columns={column} pagination={false} ></Table>
    )
}
export default SyllabusContent