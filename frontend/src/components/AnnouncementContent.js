import React from "react";
import {Card} from 'antd';
const AnnouncementContent=({time,title,content})=>{
    return (
        <Card title={title} style={{margin:'3%'}}>
            <p style={{color:"gray"}}>{time}</p>
            <p>{content}</p>
        </Card>
    )
}
export default AnnouncementContent