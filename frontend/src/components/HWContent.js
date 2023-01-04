import React, { useEffect } from "react";
import { Card, Upload, Button } from 'antd';
import { LinkOutlined, PaperClipOutlined, UploadOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { dataURItoBlob } from "../containers/hooks/functions";
import { useState } from "react";
const HWContent = ({ rawdata, handleSubmit }) => {
    // console.log(rawdata)
    let sorted = [...rawdata]
    sorted.sort(function (a, b) {
        return a.deadline > b.deadline ? 1 : -1
    })
    const [fileCnt, setFileCnt] = useState(Array(sorted.length).fill(0))
    const [fileIdx, setFileIdx] = useState(Array(sorted.length).fill(0))
    const [sList, setSList] = useState(Array(sorted.length).fill([]))
    console.log(sList)
    useEffect(() => {
        console.log(fileCnt)
    }, [fileCnt])
    return (
        sorted.map(({ title, deadline, description, tFile, sFile }, i) => {
            const gridStyle = {
                height: (1 / (tFile.length + sFile.length + 1)).toString(),
                width: "100%",
                textAlign: 'flex-start',
                fontSize: "1vw"
            };
            return (
                <Card title={title} style={{ margin: '3%' }} key={i}>
                    {<Card.Grid style={gridStyle}>{"Deadline: " + deadline}</Card.Grid>}
                    {description !== null && <Card.Grid style={gridStyle}>{"Description: " + description}</Card.Grid>}
                    {<Card.Grid style={gridStyle}>
                        <div>HW reference files: </div>
                        {tFile.map(({ fileName, fileLink, linkType }, j) => {
                            const link = linkType ? dataURItoBlob(fileLink) : fileLink
                            return (
                                <>
                                    {linkType ? <PaperClipOutlined style={{ marginRight: '1%' }} /> : <LinkOutlined style={{ marginRight: '1%' }} />}
                                    < a href={link} > {fileName}</a>
                                </>
                            )
                        })}
                    </Card.Grid>}

                    {<Card.Grid style={gridStyle}>
                        <div>Your submissions: </div>
                        {sFile !== undefined && sFile.map(({ studentID, file }, j) => {
                            const link = file.linkType ? dataURItoBlob(file.fileLink) : file.fileLink
                            return (
                                <div>
                                    {file.linkType ? <PaperClipOutlined style={{ marginRight: '1%' }} /> : <LinkOutlined style={{ marginRight: '1%' }} />}
                                    <a href={link}>{file.fileName}</a>
                                </div>
                            )
                        })}
                    </Card.Grid>}
                    <Upload
                        beforeUpload={(file) => {
                            const reader = new FileReader();

                            reader.onload = e => {
                                let tmp = [...fileCnt]
                                tmp[i]++;
                                setFileCnt(tmp)
                                tmp = [...fileIdx]
                                tmp[i]++;
                                setFileIdx(tmp)
                                let s = e.target.result
                                console.log(s)
                                tmp = [...sList]
                                console.log(tmp)
                                tmp[i].push(s)
                                
                                setSList(tmp)
                            };
                            reader.readAsDataURL(file)
                            return false;
                        }}
                        onRemove={(file) => {
                            const reader = new FileReader();

                            reader.onload = e => {
                                let tmp = [...fileCnt]
                                tmp[i]--;
                                setFileCnt(tmp)
                                let s = e.target.result
                                console.log(s)
                                tmp = [...sList]
                                tmp = tmp.filter((f) => f !== s)
                                console.log(tmp)
                                setSList(tmp)
                            };
                            reader.readAsDataURL(file.originFileObj)
                            return true
                        }
                        }
                    >
                        <Button icon={<UploadOutlined />}>{sFile.length === 0 ? "Click to Upload Your Homework" : "Click to re-Upload Your Homework"}
                        </Button>
                    </Upload>
                    {fileCnt[i] !== 0 && <Button icon={<CloudUploadOutlined />} onClick={() => handleSubmit(title, title + fileIdx[i].toString(), sList[i])}>{sFile.length === 0 ? "Click to Sumbit Your Homework" : "Click to re-Submit Your Homework"} </Button>}
                </Card >
            )
        }
        )
    )
}
export default HWContent