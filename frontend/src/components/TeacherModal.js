import { Modal, Form, Input, Select, InputNumber } from "antd";
import { useState } from "react";
const TeacherModal = ({ open, mode, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [addType, setAddType] = useState('Announcement')
    return (
        <Modal
            open={open}
            title={mode == 'add' ? 'Add' : 'Update'}
            okText={mode == 'add' ? 'Add' : 'Update'}
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
                name="form_in_modal"
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
                        ]}
                        onChange={(value) => { setAddType(value) }}
                    />
                </Form.Item>
                {addType == 'Announcement' &&
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
                {addType == 'Syllabus' &&
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
                            <InputNumber min={1}/>
                        </Form.Item>
                        <Form.Item
                            name="outline"
                            label="Outline"
                        >
                            <Input />
                        </Form.Item>
                    </>
                }
                {addType == 'File' &&
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
                                value: 'Week',
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
                        </Form.Item>
                    </>
                }
            </Form>
        </Modal >
    );
};
export default TeacherModal