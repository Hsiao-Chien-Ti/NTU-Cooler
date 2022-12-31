import React from 'react';
import { Collapse, List } from 'antd';
const { Panel } = Collapse;
const FileContent = (rawdata) => {
    let weekNum = []
    let HW = []
    let quiz = []
    let exam = []
    rawdata = rawdata.rawdata
    rawdata.map(function ({ type, info, fileName, fileLink }) {
        if (type === 'weekNum')
            weekNum.push({ fileName, fileLink })
        else if (type === 'HW')
            HW.push({ fileName, fileLink })
        else if (type === 'quiz')
            quiz.push({ fileName, fileLink })
        else if (type === 'exam')
            exam.push({ fileName, fileLink })
    }
    )
    return (
        <Collapse>
            <Panel header="Week" key="1">
                <List
                    itemLayout="horizontal"
                    dataSource={weekNum}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={item.fileLink}>{item.fileName}</a>}
                            />
                        </List.Item>
                    )}
                />
            </Panel>
            <Panel header="Homework" key="2">
                <List
                    itemLayout="horizontal"
                    dataSource={HW}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={item.fileLink}>{item.fileName}</a>}
                            />
                        </List.Item>
                    )}
                />
            </Panel>
            <Panel header="Quiz" key="3">
                <List
                    itemLayout="horizontal"
                    dataSource={quiz}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={item.fileLink}>{item.fileName}</a>}
                            />
                        </List.Item>
                    )}
                />
            </Panel>
            <Panel header="Exam" key="4">
                <List
                    itemLayout="horizontal"
                    dataSource={exam}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={item.fileLink}>{item.fileName}</a>}
                            />
                        </List.Item>
                    )}
                />
            </Panel>
        </Collapse>
    );
}
export default FileContent