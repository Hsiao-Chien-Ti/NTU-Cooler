import React from "react";
import { Card } from 'antd';
import { LinkOutlined, PaperClipOutlined } from '@ant-design/icons'
import { dataURItoBlob } from "../containers/hooks/functions";
const HomepageContent = ({ rawdata }) => {
    let sorted = [...rawdata]
    sorted.sort(function (a, b) {
        return a.weekNum > b.weekNum ? 1 : -1
    })

    return (
        sorted.map(({ weekNum, outline, file },i) => {
            const gridStyle = {
              height: (1 / (file.length + 1)).toString(),
              width: "100%",
              textAlign: "flex-start",
              fontSize: "1vw",
            };
            return (
              <Card
                title={"Week " + weekNum}
                headStyle={{ background: "#ffe38e", color: "#3e3b44" }}
                style={{ margin: "3%" }}
                key={i}>
                {outline !== "" && (
                  <Card.Grid style={gridStyle}>{outline}</Card.Grid>
                )}
                {file.map(({ fileName, fileLink, linkType }, j) => {
                  const link = linkType ? dataURItoBlob(fileLink) : fileLink;
                  // const link=fileLink
                  return (
                    <Card.Grid style={gridStyle} key={j}>
                      {linkType ? (
                        <PaperClipOutlined style={{ marginRight: "1%" }} />
                      ) : (
                        <LinkOutlined style={{ marginRight: "1%" }} />
                      )}
                      <a href={link}>{fileName}</a>
                    </Card.Grid>
                  );
                })}
              </Card>
            );
        }
        )
    )
}
export default HomepageContent