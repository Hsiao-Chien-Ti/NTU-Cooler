import React from "react";
import { Card} from 'antd';
const SyllabusContent=({weekNum,outline})=>{
    return (
        <Card title={"Week "+weekNum} style={{margin:'3%'}}>
            <p style={{fontSize:'1vw'}}>{outline}</p>
        </Card>
    )
}
export default SyllabusContent