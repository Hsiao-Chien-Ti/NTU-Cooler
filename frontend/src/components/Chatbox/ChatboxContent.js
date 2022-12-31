import { Modal, Form, Input, Button, Select } from "antd";
import { useState } from "react";
const ChatModal = ({ open, onCreate, onCancel, users }) => {
  const [form] = Form.useForm();
  const [isGroup, setIsGroup] = useState(false);
  //console.log("users:", users);

  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  return (
    <Modal
      open={open}
      title="Create a new chat room"
      okText="Create"
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
      {isGroup ? (
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="chatRoomName"
            label="Enter Chat Room Name"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the chat room!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="users"
            label="Choose People"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the person to chat!",
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              //defaultValue={["a10", "c12"]}
              //onChange={handleChange}
              options={users}
            />
          </Form.Item>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Form>
      ) : (
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the person to chat!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Form>
      )}
    </Modal>
  );
};

export default ChatModal;
