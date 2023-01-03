import React from "react";
import { Card } from 'antd';
import { LinkOutlined, PaperClipOutlined } from '@ant-design/icons'
const HomepageContent = ({ rawdata }) => {
    let sorted = [...rawdata]
    sorted.sort(function (a, b) {
        return a.weekNum > b.weekNum ? 1 : -1
    })
    function dataURItoBlob(dataURI) {
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: mime });
        return URL.createObjectURL(blob);
    }
    return (
        sorted.map(({ weekNum, outline, file }) => {
            const gridStyle = {
                height: (1 / (file.length + 1)).toString(),
                width: "100%",
                textAlign: 'flex-start',
                fontSize: "1vw"
            };
            return (
                <Card title={"Week " + weekNum} style={{ margin: '3%' }}>
                    {outline !== '' && <Card.Grid style={gridStyle}>{outline}</Card.Grid>}
                    {file.map(({ fileName, fileLink, linkType }) => {
                        const link=linkType?dataURItoBlob(fileLink):fileLink
                        // const link=fileLink
                        return (
                            <Card.Grid style={gridStyle}>
                                {linkType ? <PaperClipOutlined style={{ marginRight: '1%' }} /> : <LinkOutlined style={{ marginRight: '1%' }} />}
                                <a href={link}>{fileName}</a>
                            </Card.Grid>
                        )
                    }
                    )}
                </Card>
            )
        }
        )
    )
}
export default HomepageContent