import React from "react";
import {Card} from 'antd';
const AnnouncementContent=({rawdata})=>{
    let sorted=[...rawdata]
    sorted.sort(function(a,b){
        return a.time>b.time ? -1 : 1
    })
    return (
        sorted.map(({time,title,content})=>(
            <Card title={title} style={{margin:'3%'}}>
                <p style={{color:"gray"}}>{time}</p>
                <p>{content}</p>
            </Card>            
        )
    ))
}
export default AnnouncementContent