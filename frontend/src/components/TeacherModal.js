import { Modal, Form, Input, Select, InputNumber, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { createRef, useState } from "react";
import * as XLSX from 'xlsx'
const TeacherModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [addType, setAddType] = useState('Announcement')
    const [linkType, setLinkType] =useState(false) // false for link, true for file
    const uploadRef=createRef()
    return (
        <Modal
            open={open}
            title='Modify'
            okText='Modify'
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((e) => {
                        window.alert(e);
                    });
            }}
        >
            <Form form={form} layout="vertical"
                name="form_in_modal" ref={uploadRef}
            >
                <Form.Item
                    name="addType"
                    label="Add Type"
                    rules={[
                        {
                            required: true,
                            message: 'Error: Please select type',
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                value: 'Announcement',
                                label: 'Announcement',
                            },
                            {
                                value: 'Syllabus',
                                label: 'Syllabus',
                            },
                            {
                                value: 'File',
                                label: 'File',
                            },
                            {
                                value: 'Grade',
                                label: 'Grade',
                            },
                        ]}
                        onChange={(value) => { setAddType(value) }}
                    />
                </Form.Item>
                {addType === 'Announcement' &&
                    <>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the title of announcement!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content"
                        >
                            <Input />
                        </Form.Item>
                    </>
                }
                {addType === 'Syllabus' &&
                    <>
                        <Form.Item
                            name="weekNum"
                            label="Week"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the week number!',
                                },
                            ]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item
                            name="outline"
                            label="Outline"
                        >
                            <Input />
                        </Form.Item>
                    </>
                }
                {addType === 'File' &&
                    <>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the type of the file!',
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        value: 'weekNum',
                                        label: 'Week',
                                    },
                                    {
                                        value: 'HW',
                                        label: 'HW',
                                    },
                                    {
                                        value: 'Quiz',
                                        label: 'Quiz',
                                    },
                                    {
                                        value: 'Exam',
                                        label: 'Exam',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="info"
                            label="Info"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the info of the file!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fileName"
                            label="File Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the name of the file!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="linkType"
                            label="Link Type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the type of the link!',
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        value: false,
                                        label: 'Link',
                                    },
                                    {
                                        value: true,
                                        label: 'File',
                                    },
                                ]}
                                onChange={(value) => { setLinkType(value) }}
                            />
                        </Form.Item>
                        {!linkType&&<Form.Item
                            name="fileLink"
                            label="File Link"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the link of the file!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>}
                        {linkType&&<Form.Item name="upload">
                            <Upload
                                // accept=".txt, .csv"
                                // showUploadList={false}
                                beforeUpload={file => {
                                    const reader = new FileReader();

                                    reader.onload = e => {
                                        let s=e.target.result
                                        console.log(s)
                                        uploadRef.current.setFieldsValue({upload:s})
                                    };
                                    reader.readAsDataURL(file)
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}> Click to Upload
                                </Button>
                            </Upload>
                        </Form.Item>}
                    </>
                }
                {addType === 'Grade' &&
                    <>
                        <Form.Item
                            name="itemName"
                            label="Item Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Error: Please enter the item name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="weight"
                            label="Weight"
                        >
                            <InputNumber
                                style={{
                                    width: 200,
                                }}
                                defaultValue="0"
                                min="0"
                                max="1"
                                step="0.1"
                                stringMode
                            />
                        </Form.Item>
                        <Form.Item name="upload">
                            <Upload
                                // accept=".txt, .csv"
                                // showUploadList={false}
                                beforeUpload={file => {
                                    const reader = new FileReader();

                                    reader.onload = e => {
                                        const workbook = XLSX.read(e.target.result);
                                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            header: 1,
                                            defval: "",
                                        });
                                        uploadRef.current.setFieldsValue({upload:jsonData})
                                        console.log(jsonData);
                                    };
                                    reader.readAsArrayBuffer(file)
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}> Click to Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                    </>
                }
            </Form>
        </Modal >
    );
};
export default TeacherModal