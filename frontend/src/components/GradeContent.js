import React from "react";
import { Card, Table } from 'antd';
const GradeContent = ({ rawdata }) => {
    if(rawdata===undefined)
        return
    rawdata=rawdata.grade
    const column = [
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
        },
    ]
    let total=0
    rawdata.map((item)=>(total+=item.score*item.weight))
    const data=[...rawdata.map((item,i)=>({key:i,itemName:item.itemName,score:item.score,weight:item.weight})),{key:rawdata.length+1,itemName:"total",score:total,weight:1}]
    return (
        <Table dataSource={data} columns={column} pagination={false} ></Table>
    )
}
export default GradeContent