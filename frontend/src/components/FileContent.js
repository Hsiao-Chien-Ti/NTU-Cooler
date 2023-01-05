import React from 'react';
import { Collapse, List, theme } from "antd";
import { dataURItoBlob } from "../containers/hooks/functions";
const { Panel } = Collapse;
const FileContent = ({ rawdata, isTeacher }) => {
  // console.log(rawdata)
  // console.log(isTeacher)
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  let weekNum = [];
  let tHW = [];
  let quiz = [];
  let exam = [];
  let sHW = [];
  // rawdata = rawdata.rawdata
  // console.log(rawdata)
  rawdata.map(function ({ type, info, fileName, fileLink, linkType }) {
    fileLink = !linkType ? fileLink : dataURItoBlob(fileLink);
    if (type === "weekNum") weekNum.push({ fileName, fileLink });
    else if (type === "tHW") tHW.push({ fileName, fileLink });
    else if (type === "quiz") quiz.push({ fileName, fileLink });
    else if (type === "exam") exam.push({ fileName, fileLink });
    else if (type === "sHW" && isTeacher) sHW.push({ fileName, fileLink });
  });
  return (
    <Collapse>
      <Panel header="Week" key="1">
        <List
          itemLayout="horizontal"
          dataSource={weekNum}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    href={item.fileLink}
                    style={{ background: colorBgContainer, color: "#cf6855" }}>
                    {item.fileName}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      </Panel>
      <Panel header="Homework Reference" key="2">
        <List
          itemLayout="horizontal"
          dataSource={tHW}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    href={item.fileLink}
                    style={{ background: colorBgContainer, color: "#cf6855" }}>
                    {item.fileName}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      </Panel>
      {isTeacher && (
        <Panel header="Student submitted HW" key="3">
          <List
            itemLayout="horizontal"
            dataSource={sHW}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <a
                      href={item.fileLink}
                      style={{
                        background: colorBgContainer,
                        color: "#cf6855",
                      }}>
                      {item.fileName}
                    </a>
                  }
                />
              </List.Item>
            )}
          />
        </Panel>
      )}
      <Panel header="Quiz" key="4">
        <List
          itemLayout="horizontal"
          dataSource={quiz}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    href={item.fileLink}
                    style={{ background: colorBgContainer, color: "#cf6855" }}>
                    {item.fileName}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      </Panel>
      <Panel header="Exam" key="5">
        <List
          itemLayout="horizontal"
          dataSource={exam}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    href={item.fileLink}
                    style={{ background: colorBgContainer, color: "#cf6855" }}>
                    {item.fileName}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      </Panel>
    </Collapse>
  );
};
export default FileContent