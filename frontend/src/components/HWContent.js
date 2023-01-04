import React, { useEffect, useRef } from "react";
import { Card, Upload, Button } from 'antd';
import { LinkOutlined, PaperClipOutlined, UploadOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { dataURItoBlob } from "../containers/hooks/functions";
import { useState } from "react";
const HWContent = ({ rawdata, handleSubmit }) => {
    const [defaultFileList, setDefaultFileList] = useState([]);
    let sorted = [...rawdata]
    sorted.sort(function (a, b) {
        return a.deadline > b.deadline ? 1 : -1
    })
    const [sList, setSList] = useState([])
    // console.log(sList)
    const submitUpload = options => {
        const { onSuccess, onError, file, onProgress } = options;
        onSuccess("Ok");
    }
    const handleOnChange = ({ file, fileList, event }) => {
        // console.log(file, fileList, event);
        setDefaultFileList(fileList);         
        // if(file.status==="done")
        // {

        // //Using Hooks to update the state to the current filelist
           
        // }

        //filelist - [{uid: "-1",url:'Some url to image'}]
      };
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
                                let s = e.target.result
                                let tmp = [...sList]
                                // console.log(tmp)
                                tmp.push(s)
                                setSList(tmp)
                            };
                            reader.readAsDataURL(file)
                            return false;
                        }}
                        onRemove={(file) => {
                            const reader = new FileReader();
                            reader.onload = e => {
                                let s = e.target.result
                                // console.log(s)
                                let tmp = [...sList]
                                tmp = tmp.filter((f) => f !== s)
                                // console.log(tmp)
                                setSList(tmp)
                            };
                            reader.readAsDataURL(file.originFileObj)
                            return true
                        }
                        
                        }
                        customRequest={submitUpload}
                        fileList={defaultFileList}
                        onChange={handleOnChange}
                    >
                        <Button icon={<UploadOutlined />}>{sFile.length === 0 ? "Click to Upload Your Homework" : "Click to re-Upload Your Homework"}
                        </Button>
                        
                    </Upload>
                    {/* <Form>
                        <Form.Item name="upload"
                            label="upload"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the name of the file!',
                                },
                            ]}>

                        </Form.Item>
                    </Form> */}

                    {sList.length!== 0 && <Button icon={<CloudUploadOutlined />} onClick={() => { handleSubmit(title, sList); setSList([]);setDefaultFileList([]);}}>{sFile.length === 0 ? "Click to Sumbit Your Homework" : "Click to re-Submit Your Homework"} </Button>}
                </Card >
            )
        }
        )
    )
}
export default HWContent