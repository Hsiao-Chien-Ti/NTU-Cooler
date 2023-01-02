import { Modal, Form, Input, Button, Select, Checkbox } from "antd";
import { useState } from "react";
const makeName = (name, to) => {
  return [name, to].sort().join("_");
};
const ChatModal = ({ open, onCreate, onCancel, users, me, isTeacher }) => {
  const [form] = Form.useForm();
  const [isGroup, setIsGroup] = useState(false);
  //console.log("users:", users);

  const handleCreateGroup = () => {
    setIsGroup(!isGroup);
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
            onCreate({
              name: isGroup ? values.chatRoomName : makeName(values.name, me),
              participants: isGroup ? [...values.users, me] : [values.name, me],
              quiz: isTeacher ? (isGroup ? values.quiz : false) : false,
            });
            setIsGroup(false);
          })
          .catch((e) => {
            window.alert(e);
          });
      }}
    >
      {isGroup ? (
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
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
          {isTeacher ? (
            <Form.Item
              name="quiz"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Make it a quiz</Checkbox>
            </Form.Item>
          ) : (
            <></>
          )}

          <Button onClick={handleCreateGroup}>Single Chat</Button>
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
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={users}
            />
          </Form.Item>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Form>
      )}
    </Modal>
  );
};

export default ChatModal;
