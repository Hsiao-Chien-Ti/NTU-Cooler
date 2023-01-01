import React from "react";
import { Card} from 'antd';
import {LinkOutlined} from '@ant-design/icons'
const HomepageContent=({weekNum,outline,file})=>{
    const gridStyle = {
        height: (1/(file.length+1)).toString(),
        width:"100%",
        textAlign: 'flex-start',
        fontSize:"1vw"
      };
    return (
        <Card title={"Week "+weekNum} style={{margin:'3%'}}>
        {outline!==''&&<Card.Grid style={gridStyle}>{outline}</Card.Grid>}
            {file.map(({fileName,fileLink})=>(
                <Card.Grid style={gridStyle}>
                    <LinkOutlined style={{marginRight:'1%'}}/>
                    <a href={fileLink}>{fileName}</a>
                </Card.Grid>
            ))}
        </Card>
    )
}
export default HomepageContent